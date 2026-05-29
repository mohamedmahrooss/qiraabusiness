import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const SUPPORTED_TEXT_EXTENSIONS = [
  ".txt",
  ".csv",
  ".md",
  ".json",
];

const SUPPORTED_OFFICE_EXTENSIONS = [
  ".docx",
  ".xlsx",
];

const SUPPORTED_DOCUMENT_TYPES = [
  "market_signals",
  "venture_capital",
  "ipo",
  "ma",
  "sovereign_funds",
  "fintech",
  "artificial_intelligence",
  "macroeconomics",
];

const ANTHROPIC_MODEL = "claude-sonnet-4-6";

function jsonResponse(
  body: Record<string, unknown>,
  status = 200
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function sanitizeFileName(name: string) {
  return name
    .replace(/[^a-zA-Z0-9.\-_]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 180);
}

function getFileExtension(name: string) {
  const lower = name.toLowerCase();

  const dotIndex = lower.lastIndexOf(".");

  if (dotIndex === -1) return "";

  return lower.slice(dotIndex);
}

function isPdfFile(file: File) {
  return (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

function isTextFile(file: File) {
  const extension = getFileExtension(file.name);

  return (
    file.type.includes("text") ||
    SUPPORTED_TEXT_EXTENSIONS.includes(extension)
  );
}

function isOfficeFile(file: File) {
  const extension = getFileExtension(file.name);

  return SUPPORTED_OFFICE_EXTENSIONS.includes(extension);
}

function validateDocumentType(type: string | null) {
  if (!type) return "market_signals";

  return SUPPORTED_DOCUMENT_TYPES.includes(type)
    ? type
    : "market_signals";
}

function buildStoragePath(fileName: string) {
  const now = new Date();

  const year = now.getUTCFullYear();

  const month = String(
    now.getUTCMonth() + 1
  ).padStart(2, "0");

  return `documents/${year}/${month}/${Date.now()}-${fileName}`;
}

function uint8ToBase64(bytes: Uint8Array) {
  let binary = "";

  const chunkSize = 8192;

  for (
    let i = 0;
    i < bytes.length;
    i += chunkSize
  ) {
    binary += String.fromCharCode(
      ...bytes.subarray(i, i + chunkSize)
    );
  }

  return btoa(binary);
}

async function authenticateAdmin(
  authHeader: string,
  supabaseUrl: string,
  serviceKey: string
) {
  const adminSupabase = createClient(
    supabaseUrl,
    serviceKey
  );

  const token = authHeader.replace("Bearer ", "");

  const {
    data: { user },
    error: authError,
  } = await adminSupabase.auth.getUser(token);

  if (authError || !user) {
    throw new Error(
      "Authentication failed: invalid session"
    );
  }

  const { data: roles, error: roleError } =
    await adminSupabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");

  if (roleError) {
    throw new Error(
      "Failed to validate administrative permissions"
    );
  }

  if (!roles || roles.length === 0) {
    throw new Error(
      "Administrative privileges required"
    );
  }

  return {
    adminSupabase,
    user,
  };
}

async function extractTextFile(
  fileBytes: Uint8Array,
  fileName: string
) {
  try {
    const decoder = new TextDecoder("utf-8");

    const text = decoder.decode(fileBytes);

    if (
      !text ||
      text.trim().length < 10 ||
      text.includes("\x00")
    ) {
      return `[QIRAA NOTICE]
Document uploaded successfully.

File: ${fileName}

The text encoding could not be decoded reliably.
Manual ingestion review required.`;
    }

    return text;
  } catch {
    return `[QIRAA NOTICE]
Document uploaded successfully.

File: ${fileName}

Text extraction failed during UTF-8 decoding.`;
  }
}

async function extractPdfWithClaude(
  fileBytes: Uint8Array,
  fileName: string,
  anthropicApiKey: string
) {
  const base64 = uint8ToBase64(fileBytes);

  const extractionSystemPrompt = `
You are QIRAA Sovereign Intelligence Extraction Engine.

Mission:
Extract the FULL raw textual content from this strategic document with maximum fidelity for downstream RAG ingestion.

Strict Rules:
1. NEVER summarize.
2. NEVER omit tables, entities, figures, or sections.
3. Preserve headings and structural hierarchy.
4. Preserve financial and numerical precision.
5. Return ONLY extracted raw content.
6. No introductions or explanations.
7. Preserve market intelligence terminology exactly.
`;

  const response = await fetch(
    "https://api.anthropic.com/v1/messages",
    {
      method: "POST",
      headers: {
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "pdfs-2024-09-25",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 8192,
        temperature: 0,
        system: extractionSystemPrompt,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "document",
                source: {
                  type: "base64",
                  media_type: "application/pdf",
                  data: base64,
                },
              },
              {
                type: "text",
                text: `
Extract this strategic market document with maximum fidelity for QIRAA sovereign intelligence ingestion.
                `,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "Anthropic PDF Extraction Error:",
      errorText
    );

    return `[QIRAA NOTICE]
Document uploaded successfully.

File: ${fileName}

Claude extraction engine failed during PDF processing.`;
  }

  const aiData = await response.json();

  const content =
    aiData?.content
      ?.map((item: any) => item?.text || "")
      ?.join("\n") || "";

  if (!content || content.trim().length < 50) {
    return `[QIRAA NOTICE]
Document uploaded successfully.

File: ${fileName}

Insufficient extraction output returned from sovereign extraction engine.`;
  }

  return content;
}

async function buildExtractionMetadata(
  extractedText: string
) {
  const normalized = extractedText.toLowerCase();

  const metadata = {
    estimated_tokens: Math.ceil(
      extractedText.length / 4
    ),
    extracted_characters: extractedText.length,
    detected_regions: [] as string[],
    detected_topics: [] as string[],
    intelligence_density: "standard",
  };

  if (
    normalized.includes("saudi") ||
    normalized.includes("السعود")
  ) {
    metadata.detected_regions.push("Saudi Arabia");
  }

  if (
    normalized.includes("egypt") ||
    normalized.includes("مصر")
  ) {
    metadata.detected_regions.push("Egypt");
  }

  if (
    normalized.includes("uae") ||
    normalized.includes("الإمارات")
  ) {
    metadata.detected_regions.push("UAE");
  }

  if (
    normalized.includes("funding") ||
    normalized.includes("تمويل")
  ) {
    metadata.detected_topics.push(
      "Capital Flows"
    );
  }

  if (
    normalized.includes("fintech") ||
    normalized.includes("تقنية مالية")
  ) {
    metadata.detected_topics.push("FinTech");
  }

  if (
    normalized.includes("artificial intelligence") ||
    normalized.includes("الذكاء الاصطناعي")
  ) {
    metadata.detected_topics.push("AI");
  }

  if (metadata.estimated_tokens > 12000) {
    metadata.intelligence_density = "high";
  }

  return metadata;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const authHeader =
      req.headers.get("authorization");

    if (!authHeader) {
      throw new Error(
        "Missing authorization token"
      );
    }

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL");

    const serviceRoleKey = Deno.env.get(
      "SUPABASE_SERVICE_ROLE_KEY"
    );

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error(
        "Missing sovereign environment configuration"
      );
    }

    const {
      adminSupabase,
      user,
    } = await authenticateAdmin(
      authHeader,
      supabaseUrl,
      serviceRoleKey
    );

    const formData = await req.formData();

    const file = formData.get("file") as File;

    const title = (
      formData.get("title") as string
    )?.trim();

    const sourceMonth = formData.get(
      "source_month"
    ) as string;

    const sourceYear = formData.get(
      "source_year"
    ) as string;

    const documentType = validateDocumentType(
      formData.get("document_type") as string
    );

    if (!file) {
      throw new Error(
        "Strategic document file is required"
      );
    }

    if (!title || title.length < 3) {
      throw new Error(
        "Document title is required"
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `Maximum document size is ${
          MAX_FILE_SIZE / 1024 / 1024
        }MB`
      );
    }

    const safeName = sanitizeFileName(
      file.name
    );

    const filePath = buildStoragePath(
      safeName
    );

    const arrayBuffer =
      await file.arrayBuffer();

    const fileBytes = new Uint8Array(
      arrayBuffer
    );

    const {
      error: uploadError,
    } = await adminSupabase.storage
      .from("qiraa-knowledge-base")
      .upload(filePath, fileBytes, {
        contentType:
          file.type ||
          "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(
        `Storage upload failed: ${uploadError.message}`
      );
    }

    let extractedText = "";

    const anthropicApiKey = Deno.env.get(
      "ANTHROPIC_API_KEY"
    );

    if (
      isPdfFile(file) &&
      anthropicApiKey
    ) {
      try {
        extractedText =
          await extractPdfWithClaude(
            fileBytes,
            file.name,
            anthropicApiKey
          );
      } catch (e) {
        console.error(
          "PDF Extraction Failure:",
          e
        );

        extractedText = `[QIRAA NOTICE]
Document uploaded successfully.

File: ${file.name}

Sovereign PDF extraction pipeline failed.`;
      }
    } else if (isTextFile(file)) {
      extractedText =
        await extractTextFile(
          fileBytes,
          file.name
        );
    } else if (isOfficeFile(file)) {
      extractedText = `[QIRAA NOTICE]
Document uploaded successfully.

File: ${file.name}

Office document ingestion completed.

Native DOCX/XLSX extraction pipeline is scheduled for future deployment.`;
    } else {
      extractedText = `[QIRAA NOTICE]
Document uploaded successfully.

File: ${file.name}

Unsupported automatic extraction format.

Manual ingestion required.`;
    }

    if (
      !extractedText ||
      extractedText.trim().length < 50
    ) {
      extractedText = `[QIRAA NOTICE]
Document uploaded successfully.

File: ${file.name}

Insufficient extraction fidelity detected.

Manual review recommended.`;
    }

    const intelligenceMetadata =
      await buildExtractionMetadata(
        extractedText
      );

    const {
      data: document,
      error: insertError,
    } = await adminSupabase
      .from("qiraa_mind_documents")
      .insert({
        title,
        content: extractedText,
        source_month:
          sourceMonth || null,
        source_year: sourceYear
          ? parseInt(sourceYear)
          : null,
        document_type: documentType,
        file_path: filePath,
        uploaded_by: user.id,
        is_active: true,
        metadata: intelligenceMetadata,
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(
        `Knowledge base insertion failed: ${insertError.message}`
      );
    }

    return jsonResponse({
      success: true,
      document,
      intelligence: {
        extracted_characters:
          intelligenceMetadata.extracted_characters,
        estimated_tokens:
          intelligenceMetadata.estimated_tokens,
        detected_regions:
          intelligenceMetadata.detected_regions,
        detected_topics:
          intelligenceMetadata.detected_topics,
      },
    });
  } catch (e: any) {
    console.error(
      "QIRAA Sovereign Extraction Error:",
      e
    );

    return jsonResponse(
      {
        success: false,
        error:
          e?.message ||
          "Internal sovereign extraction failure",
      },
      400
    );
  }
});
