import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("Missing authorization");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");
    if (!roles || roles.length === 0) throw new Error("Admin access required");

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const sourceMonth = formData.get("source_month") as string;
    const sourceYear = formData.get("source_year") as string;
    const documentType = formData.get("document_type") as string;

    if (!file || !title) throw new Error("File and title are required");

    // Upload file to storage
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `documents/${fileName}`;
    const arrayBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("qiraa-knowledge-base")
      .upload(filePath, fileBytes, { contentType: file.type });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    // Extract text from the file
    // For PDF/DOCX, we use the Lovable AI Gateway to extract text
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    let extractedText = "";

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      // For PDFs, convert to base64 and use AI to extract text
      const base64 = btoa(String.fromCharCode(...fileBytes));
      
      if (LOVABLE_API_KEY) {
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: "Extract ALL text content from this PDF document. Return ONLY the raw text, preserving the structure. Do not summarize or modify anything." },
                  { type: "image_url", image_url: { url: `data:application/pdf;base64,${base64}` } }
                ]
              }
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          extractedText = aiData.choices?.[0]?.message?.content || "";
        }
      }
    } else {
      // For non-PDF files (DOCX, TXT, etc.), try to read as text
      try {
        const decoder = new TextDecoder("utf-8");
        extractedText = decoder.decode(fileBytes);
        // If it looks like binary, it's probably a DOCX - set a placeholder
        if (extractedText.includes("\x00") || extractedText.length < 10) {
          extractedText = `[Document uploaded: ${file.name}. Content extraction pending manual review.]`;
        }
      } catch {
        extractedText = `[Document uploaded: ${file.name}]`;
      }
    }

    // If no text extracted, use AI to try harder
    if (!extractedText || extractedText.length < 50) {
      extractedText = `[Document: ${file.name} uploaded successfully. Please paste the text content manually or re-upload as PDF for automatic extraction.]`;
    }

    // Insert document record
    const { data: doc, error: insertError } = await supabase
      .from("qiraa_mind_documents")
      .insert({
        title,
        content: extractedText,
        source_month: sourceMonth || null,
        source_year: sourceYear ? parseInt(sourceYear) : null,
        document_type: documentType || "market_signals",
        file_path: filePath,
        uploaded_by: user.id,
      })
      .select()
      .single();

    if (insertError) throw new Error(`Insert failed: ${insertError.message}`);

    return new Response(JSON.stringify({ success: true, document: doc }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("extract-document error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
