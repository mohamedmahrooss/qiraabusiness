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
  isAuthenticated, 
  onLogin, 
  onUpgrade 
}: { 
  isRTL: boolean; 
  isAuthenticated: boolean;
  onLogin: () => void; 
  onUpgrade: () => void;
}) => {
  const features = isRTL
    ? [
        { icon: Brain, title: "محرك ذكاء الأسواق السيادي", desc: "تحليل استراتيجي لحظي مبني على بيانات الأسواق المباشرة في منطقة الشرق الأوسط وشمال أفريقيا" },
        { icon: Shield, title: "منظومة مضادة للهلوسة", desc: "الإجابات مدعومة حصرياً بإشارات الأسواق اللحظية وبيانات منصة قراءة" },
        { icon: Database, title: "تحليل تدفقات رأس المال", desc: "تتبع جولات التمويل والمستثمرين واتجاهات رأس المال لحظياً" },
        { icon: Radar, title: "استشارات تنفيذية احترافية", desc: "موجزات استخباراتية مهيكلة لصناع القرار والمستثمرين" },
      ]
    : [
        { icon: Brain, title: "Sovereign Market Intelligence Engine", desc: "Realtime strategic analysis built on live MENA market intelligence" },
        { icon: Shield, title: "Anti-Hallucination Architecture", desc: "Responses grounded exclusively in live QIRAA intelligence signals" },
        { icon: Database, title: "Capital Flow Intelligence", desc: "Track funding rounds, investors, and market momentum in realtime" },
        { icon: Radar, title: "Executive Strategic Briefings", desc: "Professional intelligence outputs designed for decision-makers" },
      ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background flex items-center justify-center">
      <div className="max-w-5xl w-full mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 border border-primary/20 rounded-full px-4 py-1.5 mb-6 bg-primary/5">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-primary text-xs font-mono tracking-wider uppercase">
            {isRTL ? "محرك استخبارات الأسواق السيادي" : "SOVEREIGN MARKET INTELLIGENCE ENGINE"}
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-5 tracking-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {isRTL ? "عقل قراءة" : "QIRAA MIND"}
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-12 leading-relaxed">
          {isRTL
            ? "محرك ذكاء الأسواق اللحظي المتخصص في أسواق الشرق الأوسط وشمال أفريقيا لتحليل تدفقات رأس المال والاستثمارات والقطاعات الناشئة"
            : "Realtime market intelligence engine specialized in MENA capital flows, funding activity, strategic sectors, and emerging market signals"}
        </p>
        <div className="grid md:grid-cols-2 gap-6 mb-12 text-start">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-4 p-6 rounded-2xl border border-border bg-card">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isAuthenticated ? (
            <>
              <Button size="lg" onClick={onLogin} className="text-base px-8">{isRTL ? "تسجيل الدخول" : "Sign In"}</Button>
              <Button size="lg" variant="outline" onClick={onLogin} className="text-base px-8">{isRTL ? "إنشاء حساب جديد" : "Create Account"}</Button>
            </>
          ) : (
            <Button size="lg" onClick={onUpgrade} className="text-base px-8">
              {isRTL ? "ترقية الباقة (Pro / Enterprise)" : "Upgrade Plan (Pro / Enterprise)"}
            </Button>
          )}
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
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  return { isListening, transcript, startListening, stopListening, setTranscript };
};

async function readFileAsText(file: File): Promise<string> {
  const textTypes = ["text/plain", "text/csv", "text/markdown", "application/json"];
  if (textTypes.some((t) => file.type.startsWith(t) || file.type === t)) {
    return await file.text();
  }
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
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
  const [isDeepDive, setIsDeepDive] = useState(false);
  const [connectionState, setConnectionState] = useState<"idle" | "connecting" | "streaming">("idle");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null); // تمت الإضافة: حالة الصلاحية
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedFileContent, setAttachedFileContent] = useState("");
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [fileProcessingState, setFileProcessingState] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const outputRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingContentRef = useRef("");
  const streamFlushIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pendingChunkRef = useRef("");

  const { isListening, transcript, startListening, stopListening, setTranscript } = useVoiceInput(language);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      if (streamFlushIntervalRef.current) clearInterval(streamFlushIntervalRef.current);
      stopListening();
    };
  }, [stopListening]);

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [messages, isAnalyzing]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 220) + "px";
    }
  }, [input]);

  // تمت الإضافة: فحص الصلاحية وحالة التسجيل المدمجة
  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setIsAuthenticated(false);
        setHasAccess(false);
        return;
      }
      setIsAuthenticated(true);

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");
        
      const isAdmin = roles && roles.length > 0;

      const { data } = await supabase
        .from("profiles")
        .select("has_qiraa_mind")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (isAdmin) {
        setHasAccess(true);
      } else {
        setHasAccess(data?.has_qiraa_mind === true);
      }
    };
    check();
  }, [isLoading]);

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({ title: isRTL ? "تم النسخ" : "Copied!", duration: 1500 });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleMicClick = () => {
    if (isListening) stopListening();
    else {
      const supported = startListening();
      if (!supported) {
        toast({
          title: isRTL ? "غير مدعوم" : "Not Supported",
          description: isRTL ? "المتصفح لا يدعم التعرف على الصوت" : "Speech recognition is not supported",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileSelect = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: isRTL ? "الملف كبير جداً" : "File too large",
        description: isRTL ? `الحد الأقصى ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB` : `Maximum ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB`,
        variant: "destructive",
      });
      return;
    }
    setIsReadingFile(true);
    try {
      setFileProcessingState(isRTL ? "جاري تجهيز الملف..." : "Preparing document...");
      const content = await readFileAsText(file);
      setAttachedFile(file);
      setAttachedFileContent(content);
      setTimeout(() => setFileProcessingState(""), 1000);
    } catch (e) {
      toast({ title: isRTL ? "فشل معالجة الملف" : "Failed to process document", variant: "destructive" });
    } finally {
      setIsReadingFile(false);
    }
  };

  const appendAssistantChunk = useCallback((chunk: string) => {
    pendingChunkRef.current += chunk;
  }, []);

  const startChunkFlushLoop = useCallback(() => {
    if (streamFlushIntervalRef.current) clearInterval(streamFlushIntervalRef.current);
    streamFlushIntervalRef.current = setInterval(() => {
      if (!pendingChunkRef.current) return;
      streamingContentRef.current += pendingChunkRef.current;
      pendingChunkRef.current = "";
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex]?.role === "assistant") {
          updated[lastIndex] = { role: "assistant", content: streamingContentRef.current };
        }
        return updated;
      });
    }, 70);
  }, []);

  const stopChunkFlushLoop = useCallback(() => {
    if (streamFlushIntervalRef.current) {
      clearInterval(streamFlushIntervalRef.current);
      streamFlushIntervalRef.current = null;
    }
  }, []);

  const processStreamingResponse = async (resp: Response) => {
    if (!resp.body) throw new Error("Missing stream body");
    const reader = resp.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let assistantAdded = false;
    streamingContentRef.current = "";
    pendingChunkRef.current = "";

    try {
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
            const payload = trimmed.replace(/^data:\s*/, "").trim();
            if (payload === "[DONE]") continue;
            try {
              const parsed = JSON.parse(payload);
              if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
                const deltaText = parsed.delta.text || "";
                if (!assistantAdded) {
                  setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
                  assistantAdded = true;
                  setIsAnalyzing(false);
                }
                appendAssistantChunk(deltaText);
              }
              if (parsed.type === "error") throw new Error(parsed.error?.message || "AI Engine Error");
            } catch {
              continue;
            }
          }
        }
      }
    } finally {
      stopChunkFlushLoop();
    }

    if (pendingChunkRef.current) streamingContentRef.current += pendingChunkRef.current;
    
    setMessages((prev) => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      if (updated[lastIndex]?.role === "assistant") {
        updated[lastIndex] = { role: "assistant", content: streamingContentRef.current };
      }
      return updated;
    });
    return streamingContentRef.current;
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;
    if (isListening) stopListening();
    setTranscript("");

    const userMessage: Message = { role: "user", content: messageText };
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

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error(isRTL ? "يرجى تسجيل الدخول" : "Authentication required");

      const body: any = {
        messages: newMessages.slice(-20),
        is_deep_dive: isDeepDive,
      };

      if (fileContent) {
        body.user_file = { name: fileName, content: fileContent };
      }

      abortControllerRef.current = new AbortController();
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
  await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
}

      if (!resp || !resp.ok) {
        const errData = await resp?.json().catch(() => ({}));
        throw new Error(errData?.error || (isRTL ? "فشل الاتصال بمحرك قراءة" : "Failed to connect to Engine"));
      }

      setConnectionState("streaming");
      await processStreamingResponse(resp);
    } catch (error: any) {
      if (error.name === "AbortError") return;
      stopChunkFlushLoop();
      setMessages((prev) => [
        ...prev.filter((m) => !(m.role === "assistant" && m.content === "")),
        { role: "assistant", content: `**${isRTL ? "تنبيه" : "Alert"}:** ${error.message || "فشل الاتصال"}` },
      ]);
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
      setConnectionState("idle");
    }
  };

  if (isAuthenticated === null || hasAccess === null) {
    return <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  // المعالجة الهندسية המدمجة: إظهار المكون الخارجي بناءً على التسجيل والصلاحية
  if (!isAuthenticated || !hasAccess) {
    return (
      <QiraaMindLanding 
        isRTL={isRTL} 
        isAuthenticated={isAuthenticated} 
        onLogin={() => navigate("/auth")} 
        onUpgrade={() => navigate("/pricing")} 
      />
    );
  }

  const hasMessages = messages.length > 0;
  const powerQueries = [
    { label: "Analyze Q1 Trends", query: "Analyze Q1 investment trends across MENA", icon: TrendingUp },
    { label: "Egypt vs Saudi Arabia", query: "Compare startup environments in Egypt vs Saudi Arabia", icon: Globe },
    { label: "Top AgriTech Deals", query: "What are the top AgriTech deals in the region?", icon: Leaf },
    { label: "FinTech Overview", query: "Provide an overview of the MENA FinTech sector", icon: Zap },
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background flex flex-col">
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 flex flex-col justify-end">
        {hasMessages && (
          <div ref={outputRef} className="flex-1 overflow-y-auto space-y-6 pb-8">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === "user" ? (
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary font-bold">Q</div>
                    <p className="text-foreground text-sm pt-1.5 whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ) : (
                  <div className="border border-border rounded-2xl p-6 bg-card relative group shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-primary text-xs font-mono uppercase">QIRAA MIND</span>
                      </div>
                      {msg.content && !isLoading && (
                        <button onClick={() => copyToClipboard(msg.content, i)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-muted rounded">
                          {copiedIndex === i ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                        </button>
                      )}
                    </div>
                    <ReactMarkdown
                      className="prose prose-sm dark:prose-invert max-w-none"
                    >
                      {msg.content || "..."}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="w-full">
          {attachedFile && (
            <div className="w-full max-w-3xl mx-auto mb-3">
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{attachedFile.name}</span>
                </div>
                <button onClick={removeAttachedFile} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
              </div>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="w-full max-w-3xl mx-auto relative">
            <div className="relative radiant-input-wrapper rounded-2xl">
              <div className="radiant-input-border rounded-2xl" />
              <div className="relative flex items-center bg-card/95 backdrop-blur-xl border border-border rounded-2xl px-4 py-3 gap-2">
                
                {/* زر رفع الملفات */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <Paperclip className="h-5 w-5" />
                </button>

                {/* زر Deep Dive */}
                <button
                  type="button"
                  onClick={() => setIsDeepDive(!isDeepDive)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-all ${
                    isDeepDive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                  title="Deep Dive Mode"
                >
                  Deep Dive
                </button>

                {/* مربع النص */}
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Ask QIRAA"
                  rows={1}
                  className="flex-1 bg-transparent text-foreground placeholder-muted-foreground text-sm outline-none resize-none max-h-[150px]"
                />

                {/* زر المايكروفون */}
                <button
                  type="button"
                  onClick={handleMicClick}
                  className={`p-1 transition-colors ${isListening ? "text-red-500 animate-pulse" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Mic className="h-5 w-5" />
                </button>

                {/* زر الإرسال */}
                <button
                  type="submit"
                  disabled={isLoading || (!input.trim() && !attachedFile)}
                  className="bg-muted-foreground/20 hover:bg-primary hover:text-primary-foreground text-foreground w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                >
                  {isLoading && !isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <input type="file" ref={fileInputRef} className="hidden" accept=".txt,.csv,.md,.json,.pdf,.docx,.xlsx" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
              e.target.value = "";
            }} />
          </form>

          {!hasMessages && (
            <div className="flex flex-wrap justify-center gap-3 mt-6 max-w-3xl mx-auto">
              {powerQueries.map((q) => (
                <button
                  key={q.label}
                  onClick={() => sendMessage(q.query)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-muted-foreground text-xs hover:border-primary/40 hover:text-foreground transition-all bg-card"
                >
                  <q.icon className="h-3.5 w-3.5" />
                  {q.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QiraaMindPage;
