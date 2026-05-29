import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Brain, Loader2, Bot, User, Mic, Paperclip, X, File as FileIcon, Activity } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/qiraa-mind`;

const ALLOWED_FILE_TYPES = [
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const QiraaMind = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionState, setConnectionState] = useState<"idle" | "connecting" | "streaming">("idle");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAnalyzing]);

  // Cleanup to prevent memory leaks and zombie streams
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Speech Recognition Setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: isRTL ? "غير مدعوم" : "Not supported",
        description: isRTL ? "متصفحك لا يدعم التعرف على الصوت" : "Your browser does not support speech recognition",
        variant: "destructive",
      });
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    recognitionRef.current.lang = isRTL ? "ar-SA" : "en-US";
    recognitionRef.current.start();
    setIsRecording(true);

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };

    recognitionRef.current.onerror = () => setIsRecording(false);
    recognitionRef.current.onend = () => setIsRecording(false);
  };

  const validateFile = (file: File) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error(isRTL ? "نوع الملف غير مدعوم" : "Unsupported file type");
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(isRTL ? "حجم الملف يتجاوز الحد المسموح (5MB)" : "File size exceeds limit (5MB)");
    }
  };

  const processFile = async (file: File) => {
    validateFile(file);
    if (file.type.includes("pdf")) {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(`[BASE64_FILE:${file.type}]${base64}`);
        };
      });
      reader.readAsDataURL(file);
      const content = await base64Promise;
      return { name: file.name, content };
    }
    const text = await file.text();
    return { name: file.name, content: text };
  };

  const sendMessage = async () => {
    if (isLoading || (!input.trim() && !attachedFile)) return;

    const trimmedInput = input.trim();
    const userMessage: Message = {
      role: "user",
      content: trimmedInput || (isRTL ? "مرفق ملف للتحليل" : "File attached for analysis"),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setIsAnalyzing(true);
    setConnectionState("connecting");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error(isRTL ? "يرجى تسجيل الدخول" : "Authentication required");
      }

      let user_file = null;
      if (attachedFile) {
        user_file = await processFile(attachedFile);
      }

      // Initialize AbortController for this request
      abortControllerRef.current = new AbortController();

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        signal: abortControllerRef.current.signal,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          "x-auth-token": session.access_token,
        },
        body: JSON.stringify({ messages: updatedMessages, user_file }),
      });

      setAttachedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || (isRTL ? "فشل الاتصال بمحرك قراءة" : "Failed to connect to QIRAA Engine"));
      }

      setConnectionState("streaming");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let assistantContent = "";
      let assistantAdded = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

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

              assistantContent += deltaText;

              setMessages((prev) => {
                const updated = [...prev];
                const lastIndex = updated.length - 1;
                if (updated[lastIndex]?.role === "assistant") {
                  updated[lastIndex] = { role: "assistant", content: assistantContent };
                }
                return updated;
              });
            }

            if (parsed.type === "error") {
              throw new Error(parsed.error?.message || "AI Engine Error");
            }
          } catch {
            // Ignore incomplete JSON chunks
            continue;
          }
        }
      }
    } catch (error: any) {
      // Handle the AbortError silently without showing a toast
      if (error.name === 'AbortError') {
        console.log("Stream aborted by user or system.");
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: error.message || (isRTL ? "حدث خطأ داخلي" : "Internal error") },
      ]);

      toast({
        title: isRTL ? "خطأ" : "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
      setConnectionState("idle");
    }
  };

  return (
    <Card className="border-primary/20 shadow-xl flex flex-col h-[700px]">
      <CardHeader className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground rounded-t-xl shrink-0">
        <CardTitle className="flex items-center gap-3 text-xl">
          <Brain className="h-6 w-6" />
          {isRTL ? "عقل قراءة - المحلل الاستراتيجي" : "QIRAA Mind - Strategic Analyst"}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
          <Activity className="h-4 w-4" />
          <span>{isRTL ? "محرك ذكاء الأسواق اللحظي T+0" : "Realtime T+0 Market Intelligence Engine"}</span>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/30 dark:bg-slate-900/20">
          {messages.length === 0 && (
            <div className="text-center py-16 space-y-4 text-muted-foreground">
              <Bot className="h-14 w-14 mx-auto text-primary/40" />
              <div className="space-y-2">
                <p className="text-xl font-semibold text-foreground">
                  {isRTL ? "محرك استخبارات الأسواق السيادي" : "Sovereign Market Intelligence Engine"}
                </p>
                <p className="text-sm">
                  {isRTL ? "تحليل لحظي مدعوم ببيانات الأسواق (T+0)" : "Realtime strategic market intelligence (T+0)"}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-md mx-auto">
                <span className="bg-background px-3 py-1.5 rounded-md text-xs border border-border shadow-sm">جولات التمويل</span>
                <span className="bg-background px-3 py-1.5 rounded-md text-xs border border-border shadow-sm">الشركات الناشئة</span>
                <span className="bg-background px-3 py-1.5 rounded-md text-xs border border-border shadow-sm">المستثمرين (VCs)</span>
                <span className="bg-background px-3 py-1.5 rounded-md text-xs border border-border shadow-sm">التقنية المالية</span>
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1 border border-primary/20">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-card border border-border rounded-tl-sm shadow-sm"
              }`}>
                {msg.role === "assistant" ? (
                  // B2B Professional Markdown Rendering
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-muted prose-pre:border prose-pre:border-border">
                    <ReactMarkdown
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-lg font-bold text-primary mb-2 mt-4" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-base font-bold text-foreground mb-2 mt-4" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-sm font-bold text-foreground mb-2 mt-3" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-1 marker:text-primary/70" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-1 marker:text-primary/70" {...props} />,
                        li: ({node, ...props}) => <li className="text-sm" {...props} />,
                        p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold text-primary" {...props} />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1 border border-border">
                  <User className="h-4 w-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex gap-3 justify-start animate-pulse">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <Activity className="h-4 w-4 text-primary animate-bounce" />
              </div>
              <div className="bg-muted border border-border rounded-2xl px-5 py-3 text-sm flex items-center gap-2 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                {isRTL ? "جاري استخراج وتحليل بيانات الأسواق..." : "Extracting and analyzing market intelligence..."}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {attachedFile && (
          <div className="px-4 py-2 border-t border-border bg-card">
            <div className="flex items-center justify-between bg-muted rounded-lg p-2 border border-border/50">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileIcon className="h-4 w-4 text-primary" />
                <span className="truncate text-sm font-medium">{attachedFile.name}</span>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  ({(attachedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-destructive hover:text-destructive-foreground h-7 w-7"
                onClick={() => {
                  setAttachedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="border-t border-border p-4 bg-card rounded-b-xl">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2 items-center">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".txt,.md,.csv,.pdf,.docx,.xlsx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  validateFile(file);
                  setAttachedFile(file);
                } catch (error: any) {
                  toast({
                    title: isRTL ? "خطأ" : "Error",
                    description: error.message,
                    variant: "destructive",
                  });
                }
              }}
            />

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="flex-shrink-0 hover:bg-primary/10 hover:text-primary border-border"
              onClick={() => fileInputRef.current?.click()}
              title={isRTL ? "إرفاق ملف" : "Attach file"}
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              className={`flex-shrink-0 transition-all border-border ${isRecording ? 'animate-pulse' : 'hover:bg-primary/10 hover:text-primary'}`}
              onClick={toggleRecording}
              title={isRTL ? "تحدث" : "Speak"}
            >
              <Mic className="h-4 w-4" />
            </Button>

            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder={isRTL ? "اكتب استفسارك الاستراتيجي..." : "Type your strategic market query..."}
              className="flex-1 bg-background focus-visible:ring-primary/50"
            />

            <Button
              type="submit"
              disabled={isLoading || (!input.trim() && !attachedFile)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading && !isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          {connectionState !== "idle" && (
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground font-medium px-1">
              <Activity className="h-3 w-3 animate-pulse text-primary" />
              <span>
                {connectionState === "connecting"
                  ? isRTL ? "الاتصال بمحرك قراءة المركزي..." : "Connecting to QIRAA Engine..."
                  : isRTL ? "جاري بث التحليل الاستراتيجي اللحظي..." : "Streaming strategic intelligence..."}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QiraaMind;