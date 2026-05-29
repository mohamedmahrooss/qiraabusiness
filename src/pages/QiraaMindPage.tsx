import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2,
  Zap,
  TrendingUp,
  Globe,
  Leaf,
  Copy,
  Check,
  Brain,
  Shield,
  BarChart3,
  Sparkles,
  Lock,
  ArrowUp,
  Mic,
  X,
  FileText,
  Paperclip,
  Activity,
  Database,
  Radar,
  Cpu,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/qiraa-mind`;

/**
 * Increased significantly to support:
 * - Strategic reports
 * - Investment decks
 * - Financial spreadsheets
 * - Due diligence docs
 *
 * This aligns with enterprise-grade intelligence workflows.
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "text/plain",
  "text/csv",
  "text/markdown",
  "application/json",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const SSE_EVENT_SEPARATOR = "\n\n";

const QiraaMindLanding = ({
  isRTL,
  onLogin,
}: {
  isRTL: boolean;
  onLogin: () => void;
}) => {
  const features = isRTL
    ? [
        {
          icon: Brain,
          title: "محرك ذكاء الأسواق السيادي",
          desc: "تحليل استراتيجي لحظي مبني على بيانات الأسواق المباشرة في منطقة الشرق الأوسط وشمال أفريقيا",
        },
        {
          icon: Shield,
          title: "منظومة مضادة للهلوسة",
          desc: "الإجابات مدعومة حصرياً بإشارات الأسواق اللحظية وبيانات منصة قراءة",
        },
        {
          icon: Database,
          title: "تحليل تدفقات رأس المال",
          desc: "تتبع جولات التمويل والمستثمرين واتجاهات رأس المال لحظياً",
        },
        {
          icon: Radar,
          title: "استشارات تنفيذية احترافية",
          desc: "موجزات استخباراتية مهيكلة لصناع القرار والمستثمرين",
        },
      ]
    : [
        {
          icon: Brain,
          title: "Sovereign Market Intelligence Engine",
          desc: "Realtime strategic analysis built on live MENA market intelligence",
        },
        {
          icon: Shield,
          title: "Anti-Hallucination Architecture",
          desc: "Responses grounded exclusively in live QIRAA intelligence signals",
        },
        {
          icon: Database,
          title: "Capital Flow Intelligence",
          desc: "Track funding rounds, investors, and market momentum in realtime",
        },
        {
          icon: Radar,
          title: "Executive Strategic Briefings",
          desc: "Professional intelligence outputs designed for decision-makers",
        },
      ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background flex items-center justify-center">
      <div className="max-w-5xl w-full mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 border border-primary/20 rounded-full px-4 py-1.5 mb-6 bg-primary/5">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-primary text-xs font-mono tracking-wider uppercase">
            {isRTL
              ? "محرك استخبارات الأسواق السيادي"
              : "SOVEREIGN MARKET INTELLIGENCE ENGINE"}
          </span>
        </div>

        <h1
          className="text-5xl md:text-6xl font-bold text-foreground mb-5 tracking-tight"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {isRTL ? "عقل قراءة" : "QIRAA MIND"}
        </h1>

        <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-12 leading-relaxed">
          {isRTL
            ? "محرك ذكاء الأسواق اللحظي المتخصص في أسواق الشرق الأوسط وشمال أفريقيا لتحليل تدفقات رأس المال والاستثمارات والقطاعات الناشئة"
            : "Realtime market intelligence engine specialized in MENA capital flows, funding activity, strategic sectors, and emerging market signals"}
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12 text-start">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-6 rounded-2xl border border-border bg-card"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <f.icon className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {f.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={onLogin} className="text-base px-8">
            {isRTL ? "تسجيل الدخول" : "Sign In"}
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={onLogin}
            className="text-base px-8"
          >
            {isRTL ? "إنشاء حساب جديد" : "Create Account"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const useVoiceInput = (language: string) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return false;

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.lang = language === "ar" ? "ar-SA" : "en-US";

    recognition.onstart = () => setIsListening(true);

    recognition.onend = () => setIsListening(false);

    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      let finalTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }

      setTranscript(finalTranscript);
    };

    recognitionRef.current = recognition;

    recognition.start();

    return true;
  }, [language]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsListening(false);
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    setTranscript,
  };
};

async function readFileAsText(file: File): Promise<string> {
  const textTypes = [
    "text/plain",
    "text/csv",
    "text/markdown",
    "application/json",
  ];

  if (
    textTypes.some(
      (t) => file.type.startsWith(t) || file.type === t
    )
  ) {
    return await file.text();
  }

  const buffer = await file.arrayBuffer();

  const bytes = new Uint8Array(buffer);

  let binary = "";

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return `[BASE64_FILE:${file.name}:${file.type}]` + btoa(binary);
}

const QiraaMindPage = () => {
  const { isRTL, language } = useLanguage();

  const { toast } = useToast();

  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);

  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [connectionState, setConnectionState] = useState<
    "idle" | "connecting" | "streaming"
  >("idle");

  const [tokensLeft, setTokensLeft] = useState<number | null>(null);

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const [attachedFileContent, setAttachedFileContent] = useState("");

  const [isReadingFile, setIsReadingFile] = useState(false);

  const [fileProcessingState, setFileProcessingState] = useState("");

  const [marketMode] = useState("T+0 Sovereign Intelligence");

  const outputRef = useRef<HTMLDivElement>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Stream buffer to reduce excessive React rerenders
   */
  const streamingContentRef = useRef("");

  const streamFlushIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const pendingChunkRef = useRef("");

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    setTranscript,
  } = useVoiceInput(language);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (streamFlushIntervalRef.current) {
        clearInterval(streamFlushIntervalRef.current);
      }

      stopListening();
    };
  }, [stopListening]);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [messages, isAnalyzing]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";

      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 220) + "px";
    }
  }, [input]);

  useEffect(() => {
    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);

      /**
       * Fixed:
       * unified access architecture
       * backend/frontend parity
       */
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");

      const isAdmin = roles && roles.length > 0;

      const { data } = await supabase
        .from("profiles")
        .select("qiraa_mind_tokens, has_qiraa_mind")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (data) {
        setTokensLeft(data.qiraa_mind_tokens ?? 0);

        if (isAdmin) {
          setHasAccess(true);
        } else {
          setHasAccess(data.has_qiraa_mind === true);
        }
      } else {
        setHasAccess(isAdmin ? true : false);
      }
    };

    check();
  }, [isLoading]);

  const saveMessageToHistory = async (
    role: string,
    content: string
  ) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.id) {
        await supabase.from("qiraa_mind_history").insert({
          user_id: session.user.id,
          role,
          content,
        });
      }
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  };

  const copyToClipboard = async (
    text: string,
    index: number
  ) => {
    await navigator.clipboard.writeText(text);

    setCopiedIndex(index);

    toast({
      title: isRTL ? "تم النسخ" : "Copied!",
      duration: 1500,
    });

    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      const supported = startListening();

      if (!supported) {
        toast({
          title: isRTL ? "غير مدعوم" : "Not Supported",
          description: isRTL
            ? "المتصفح لا يدعم التعرف على الصوت"
            : "Speech recognition is not supported",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileSelect = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: isRTL ? "الملف كبير جداً" : "File too large",
        description: isRTL
          ? `الحد الأقصى ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB`
          : `Maximum ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB`,
        variant: "destructive",
      });

      return;
    }

    const isAllowed =
      ALLOWED_FILE_TYPES.includes(file.type) ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".csv") ||
      file.name.endsWith(".md") ||
      file.name.endsWith(".json") ||
      file.name.endsWith(".pdf") ||
      file.name.endsWith(".docx") ||
      file.name.endsWith(".xlsx");

    if (!isAllowed) {
      toast({
        title: isRTL
          ? "نوع الملف غير مدعوم"
          : "Unsupported file type",
        description: isRTL
          ? "الملفات المدعومة: TXT, CSV, MD, JSON, PDF, DOCX, XLSX"
          : "Supported: TXT, CSV, MD, JSON, PDF, DOCX, XLSX",
        variant: "destructive",
      });

      return;
    }

    setIsReadingFile(true);

    try {
      setFileProcessingState(
        isRTL
          ? "جاري استخراج الإشارات الاستراتيجية من الملف..."
          : "Extracting strategic signals from document..."
      );

      const content = await readFileAsText(file);

      setFileProcessingState(
        isRTL
          ? "جاري تحليل الكيانات والاستثمارات..."
          : "Analyzing entities and market intelligence..."
      );

      await new Promise((resolve) => setTimeout(resolve, 800));

      setAttachedFile(file);

      setAttachedFileContent(content);

      setFileProcessingState(
        isRTL
          ? "تم تجهيز الملف للتحليل الاستخباراتي"
          : "Document prepared for intelligence processing"
      );

      setTimeout(() => {
        setFileProcessingState("");
      }, 2000);
    } catch (e) {
      toast({
        title: isRTL
          ? "فشل معالجة الملف"
          : "Failed to process document",
        variant: "destructive",
      });
    } finally {
      setIsReadingFile(false);
    }
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      handleFileSelect(file);
    }

    e.target.value = "";
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);

    setAttachedFileContent("");

    setFileProcessingState("");
  };

  const handlePlusClick = () => {
    fileInputRef.current?.click();
  };

  const powerQueries = useMemo(
    () =>
      isRTL
        ? [
            {
              label: "اتجاهات رأس المال",
              query:
                "حلل اتجاهات رأس المال والاستثمارات في الشرق الأوسط وشمال أفريقيا خلال آخر 90 يوم",
              icon: TrendingUp,
            },
            {
              label: "مصر مقابل السعودية",
              query:
                "قارن بين بيئة الاستثمار في الشركات الناشئة في مصر والسعودية",
              icon: Globe,
            },
            {
              label: "الذكاء الاصطناعي",
              query:
                "ما هي أبرز تحركات واستثمارات الذكاء الاصطناعي في المنطقة؟",
              icon: Cpu,
            },
            {
              label: "التقنية المالية",
              query:
                "ما هو وضع قطاع التقنية المالية في منطقة الشرق الأوسط وشمال أفريقيا؟",
              icon: Zap,
            },
            {
              label: "AgriTech",
              query:
                "حلل أبرز استثمارات التكنولوجيا الزراعية في المنطقة",
              icon: Leaf,
            },
          ]
        : [
            {
              label: "Capital Flow Trends",
              query:
                "Analyze capital flow and funding trends across MENA during the last 90 days",
              icon: TrendingUp,
            },
            {
              label: "Egypt vs Saudi",
              query:
                "Compare startup investment environments in Egypt vs Saudi Arabia",
              icon: Globe,
            },
            {
              label: "AI Market Signals",
              query:
                "Analyze AI investment activity across the MENA region",
              icon: Cpu,
            },
            {
              label: "FinTech Intelligence",
              query:
                "What is the current state of FinTech across MENA?",
              icon: Zap,
            },
            {
              label: "AgriTech",
              query:
                "Analyze strategic AgriTech investments across the region",
              icon: Leaf,
            },
          ],
    [isRTL]
  );

  const appendAssistantChunk = useCallback((chunk: string) => {
    pendingChunkRef.current += chunk;
  }, []);

  const startChunkFlushLoop = useCallback(() => {
    if (streamFlushIntervalRef.current) {
      clearInterval(streamFlushIntervalRef.current);
    }

    streamFlushIntervalRef.current = setInterval(() => {
      if (!pendingChunkRef.current) return;

      streamingContentRef.current += pendingChunkRef.current;

      pendingChunkRef.current = "";

      setMessages((prev) => {
        const updated = [...prev];

        const lastIndex = updated.length - 1;

        if (updated[lastIndex]?.role === "assistant") {
          updated[lastIndex] = {
            role: "assistant",
            content: streamingContentRef.current,
          };
        }

        return updated;
      });
    }, 70);
  }, []);

  const stopChunkFlushLoop = useCallback(() => {
    if (streamFlushIntervalRef.current) {
      clearInterval(streamFlushIntervalRef.current);
    }

    streamFlushIntervalRef.current = null;
  }, []);

  const processStreamingResponse = async (
    resp: Response
  ) => {
    if (!resp.body) {
      throw new Error("Missing stream body");
    }

    const reader = resp.body.getReader();

    const decoder = new TextDecoder("utf-8");

    let buffer = "";

    let assistantAdded = false;

    streamingContentRef.current = "";

    pendingChunkRef.current = "";

    startChunkFlushLoop();

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split(SSE_EVENT_SEPARATOR);

      buffer = events.pop() || "";

      for (const eventChunk of events) {
        const lines = eventChunk.split("\n");

        for (const line of lines) {
          const trimmed = line.trim();

          if (!trimmed.startsWith("data:")) continue;

          const payload = trimmed
            .replace(/^data:\s*/, "")
            .trim();

          if (payload === "[DONE]") continue;

          try {
            const parsed = JSON.parse(payload);

            if (
              parsed.type === "content_block_delta" &&
              parsed.delta?.type === "text_delta"
            ) {
              const deltaText = parsed.delta.text || "";

              if (!assistantAdded) {
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "assistant",
                    content: "",
                  },
                ]);

                assistantAdded = true;

                setIsAnalyzing(false);
              }

              appendAssistantChunk(deltaText);
            }

            if (parsed.type === "error") {
              throw new Error(
                parsed.error?.message || "AI Engine Error"
              );
            }
          } catch {
            continue;
          }
        }
      }
    }

    stopChunkFlushLoop();

    if (pendingChunkRef.current) {
      streamingContentRef.current += pendingChunkRef.current;
    }

    setMessages((prev) => {
      const updated = [...prev];

      const lastIndex = updated.length - 1;

      if (updated[lastIndex]?.role === "assistant") {
        updated[lastIndex] = {
          role: "assistant",
          content: streamingContentRef.current,
        };
      }

      return updated;
    });

    return streamingContentRef.current;
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();

    if (!messageText || isLoading) return;

    if (isListening) {
      stopListening();
    }

    setTranscript("");

    if (tokensLeft !== null && tokensLeft <= 0) {
      toast({
        title: isRTL ? "نفد الرصيد" : "Out of tokens",
        description: isRTL
          ? "يرجى ترقية الباقة أو شراء رصيد إضافي"
          : "Please upgrade or purchase additional credits",
        variant: "destructive",
      });

      return;
    }

    const userMessage: Message = {
      role: "user",
      content: messageText,
    };

    const newMessages = [...messages, userMessage];

    setMessages(newMessages);

    setInput("");

    setIsLoading(true);

    setIsAnalyzing(true);

    setConnectionState("connecting");

    const fileContent = attachedFileContent;

    const fileName = attachedFile?.name || "";

    setAttachedFile(null);

    setAttachedFileContent("");

    await saveMessageToHistory(
      "user",
      messageText + (fileName ? ` [📎 ${fileName}]` : "")
    );

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error(
          isRTL
            ? "يرجى تسجيل الدخول"
            : "Authentication required"
        );
      }

      const body: any = {
        messages: newMessages,
      };

      if (fileContent) {
        body.user_file = {
          name: fileName,
          content: fileContent,
        };
      }

      abortControllerRef.current = new AbortController();

      /**
       * Lightweight retry architecture
       */
      let resp: Response | null = null;

      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          resp = await fetch(CHAT_URL, {
            method: "POST",
            signal: abortControllerRef.current.signal,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
              "x-auth-token": session.access_token,
            },
            body: JSON.stringify(body),
          });

          if (resp.ok) break;
        } catch (err) {
          if (attempt === 1) throw err;
        }

        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (attempt + 1))
        );
      }

      if (!resp || !resp.ok) {
        const errData = await resp?.json().catch(() => ({}));

        throw new Error(
          errData?.error ||
            (isRTL
              ? "فشل الاتصال بمحرك قراءة"
              : "Failed to connect to QIRAA Engine")
        );
      }

      setConnectionState("streaming");

      const assistantContent = await processStreamingResponse(
        resp
      );

      if (assistantContent) {
        await saveMessageToHistory(
          "assistant",
          assistantContent
        );
      }

      setTokensLeft((prev) =>
        prev !== null ? Math.max(prev - 1, 0) : prev
      );
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Stream safely aborted.");

        return;
      }

      stopChunkFlushLoop();

      const errMsg =
        error.message ||
        (isRTL ? "فشل الاتصال" : "Connection failed");

      setMessages((prev) => [
        ...prev.filter(
          (m) => !(m.role === "assistant" && m.content === "")
        ),
        {
          role: "assistant",
          content: `**${
            isRTL ? "تنبيه النظام" : "System Alert"
          }:** ${errMsg}`,
        },
      ]);
    } finally {
      setIsLoading(false);

      setIsAnalyzing(false);

      setConnectionState("idle");
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <QiraaMindLanding
        isRTL={isRTL}
        onLogin={() => navigate("/auth")}
      />
    );
  }

  if (hasAccess === false) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-background flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto px-4 text-center space-y-8">
          <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Lock className="h-6 w-6 text-destructive" />

              <h2 className="text-xl font-bold text-destructive">
                {isRTL
                  ? "الوصول يتطلب تفعيل عقل قراءة"
                  : "QIRAA Mind Access Required"}
              </h2>
            </div>

            <p className="text-muted-foreground text-base mb-6">
              {isRTL
                ? "هذه الخاصية متاحة فقط للمستخدمين الذين تم تفعيل وصول عقل قراءة لهم"
                : "This feature requires QIRAA Mind access activation"}
            </p>

            <Button
              onClick={() => navigate("/pricing")}
              size="lg"
              className="text-base px-8"
            >
              {isRTL ? "ترقية الباقة" : "Upgrade Plan"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background flex flex-col">
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 flex flex-col">
        {!hasMessages && (
          <div className="text-center pt-12 pb-10">
            <div className="inline-flex items-center gap-2 border border-primary/20 rounded-full px-4 py-1.5 mb-5 bg-primary/5">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />

              <span className="text-primary text-xs font-mono uppercase tracking-wider">
                {marketMode}
              </span>
            </div>

            <h1
              className="text-4xl md:text-5xl font-bold text-foreground mb-4"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {isRTL ? "عقل قراءة" : "QIRAA MIND"}
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {isRTL
                ? "محرك استخبارات الأسواق اللحظي لتحليل الاستثمارات والشركات والقطاعات في الشرق الأوسط وشمال أفريقيا"
                : "Realtime sovereign market intelligence engine specialized in MENA investment activity and strategic market signals"}
            </p>
          </div>
        )}

        {hasMessages && (
          <div
            ref={outputRef}
            className="flex-1 overflow-y-auto space-y-6 pb-4"
          >
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === "user" ? (
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold bg-primary/10 text-primary"
                      style={{ fontFamily: "monospace" }}
                    >
                      Q
                    </div>

                    <p className="text-foreground text-sm pt-1.5 whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                ) : (
                  <div className="border border-border rounded-2xl p-6 bg-card relative group shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="w-2 h-2 rounded-full bg-primary" />

                        <span className="text-primary text-xs font-mono uppercase tracking-wider">
                          {isRTL
                            ? "موجز استخباراتي"
                            : "INTELLIGENCE BRIEF"}
                        </span>

                        {isLoading &&
                          i === messages.length - 1 && (
                            <Loader2 className="h-3 w-3 text-primary animate-spin" />
                          )}

                        <span className="text-[10px] text-muted-foreground border border-border rounded-full px-2 py-0.5">
                          T+0
                        </span>
                      </div>

                      {msg.content && !isLoading && (
                        <button
                          onClick={() =>
                            copyToClipboard(msg.content, i)
                          }
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-muted"
                          title={isRTL ? "نسخ" : "Copy"}
                        >
                          {copiedIndex === i ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      )}
                    </div>

                    <ReactMarkdown
                      className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-headings:font-mono prose-headings:text-primary prose-strong:text-foreground prose-li:text-muted-foreground"
                      components={{
                        h1: ({ node, ...props }) => (
                          <h1
                            className="text-lg font-bold text-primary mb-2 mt-4"
                            {...props}
                          />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2
                            className="text-base font-bold text-foreground mb-2 mt-4"
                            {...props}
                          />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3
                            className="text-sm font-bold text-foreground mb-2 mt-3"
                            {...props}
                          />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul
                            className="list-disc list-inside mb-4 space-y-1 marker:text-primary/70"
                            {...props}
                          />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol
                            className="list-decimal list-inside mb-4 space-y-1 marker:text-primary/70"
                            {...props}
                          />
                        ),
                        p: ({ node, ...props }) => (
                          <p
                            className="mb-3 last:mb-0"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {msg.content || "..."}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ))}

            {isAnalyzing && (
              <div className="flex items-start gap-3 mb-4 animate-pulse">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10 border border-primary/20">
                  <Activity className="h-4 w-4 text-primary animate-bounce" />
                </div>

                <div className="border border-border rounded-2xl p-4 bg-card shadow-sm flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />

                    <span className="text-sm text-muted-foreground font-medium">
                      {isRTL
                        ? "جاري تحليل الإشارات السوقية اللحظية..."
                        : "Processing realtime market intelligence..."}
                    </span>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {connectionState === "connecting"
                      ? isRTL
                        ? "الاتصال بمحرك قراءة السيادي..."
                        : "Connecting to sovereign intelligence engine..."
                      : isRTL
                      ? "بث التحليل الاستراتيجي اللحظي..."
                      : "Streaming strategic intelligence..."}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div
          className={`${
            hasMessages
              ? "mt-4"
              : "flex-1 flex flex-col items-center justify-center"
          } mb-2 w-full`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".txt,.csv,.md,.json,.pdf,.docx,.xlsx"
            onChange={handleFileInputChange}
          />

          {attachedFile && (
            <div className="w-full max-w-3xl mx-auto mb-3">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20 text-sm">
                <FileText className="h-4 w-4 text-primary flex-shrink-0" />

                <div className="flex-1 min-w-0">
                  <div className="truncate text-foreground font-medium">
                    {attachedFile.name}
                  </div>

                  <div className="text-xs text-muted-foreground mt-0.5">
                    {(attachedFile.size / 1024 / 1024).toFixed(
                      2
                    )}
                    MB
                  </div>
                </div>

                <button
                  onClick={removeAttachedFile}
                  className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {fileProcessingState && (
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />

                  <span>{fileProcessingState}</span>
                </div>
              )}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();

              sendMessage();
            }}
            className="w-full max-w-3xl mx-auto"
          >
            <div className="relative radiant-input-wrapper rounded-2xl">
              <div className="radiant-input-border rounded-2xl" />

              <div className="relative rounded-2xl bg-card/95 backdrop-blur-xl overflow-hidden border border-border">
                <div className="flex items-end gap-2 px-4 py-3">
                  <button
                    type="button"
                    onClick={handlePlusClick}
                    disabled={
                      isReadingFile ||
                      !!attachedFile ||
                      isLoading
                    }
                    className="flex-shrink-0 w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors mb-0.5 disabled:opacity-30"
                    title={
                      isRTL ? "إرفاق ملف" : "Attach document"
                    }
                  >
                    {isReadingFile ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Paperclip className="h-5 w-5" />
                    )}
                  </button>

                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        !e.shiftKey
                      ) {
                        e.preventDefault();

                        sendMessage();
                      }
                    }}
                    placeholder={
                      isRTL
                        ? "اسأل عقل قراءة عن الاستثمارات أو القطاعات أو الشركات..."
                        : "Ask QIRAA Mind about sectors, investments, companies, or market intelligence..."
                    }
                    disabled={isLoading}
                    rows={1}
                    className="flex-1 bg-transparent text-foreground placeholder-muted-foreground text-base outline-none resize-none max-h-[220px] py-2"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      direction: isRTL ? "rtl" : "ltr",
                    }}
                  />

                  <div className="flex items-center gap-1.5 mb-0.5">
                    <button
                      type="button"
                      onClick={handleMicClick}
                      disabled={isLoading}
                      className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 ${
                        isListening
                          ? "bg-red-500 text-white animate-pulse"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Mic className="h-5 w-5" />
                    </button>

                    <button
                      type="submit"
                      disabled={
                        isLoading ||
                        (!input.trim() && !attachedFile)
                      }
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 bg-foreground text-background hover:bg-foreground/80"
                    >
                      {isLoading && !isAnalyzing ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <ArrowUp className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {connectionState !== "idle" && (
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground font-medium w-full">
                <Activity className="h-3 w-3 animate-pulse text-primary" />

                <span>
                  {connectionState === "connecting"
                    ? isRTL
                      ? "الاتصال بمحرك قراءة المركزي..."
                      : "Connecting to QIRAA Core Engine..."
                    : isRTL
                    ? "جاري بث التحليل الاستراتيجي اللحظي..."
                    : "Streaming strategic intelligence..."}
                </span>
              </div>
            )}

            {!hasMessages && (
              <div className="flex flex-wrap justify-center gap-3 mt-7 max-w-3xl mx-auto">
                {powerQueries.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => sendMessage(q.query)}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-muted-foreground text-sm hover:border-primary/40 hover:text-primary transition-all bg-card disabled:opacity-50"
                  >
                    <q.icon className="h-4 w-4" />

                    {q.label}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default QiraaMindPage;
