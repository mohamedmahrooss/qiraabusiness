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

const QiraaMindLanding = ({ isRTL, onLogin }: { isRTL: boolean; onLogin: () => void }) => {
  const features = isRTL
    ? [
        { icon: Brain, title: "محرك ذكاء الأسواق السيادي", desc: "تحليل استراتيجي لحظي مبني على بيانات الأسواق المباشرة" },
        { icon: Shield, title: "منظومة مضادة للهلوسة", desc: "الإجابات مدعومة حصرياً بإشارات الأسواق اللحظية" },
        { icon: Database, title: "تحليل تدفقات رأس المال", desc: "تتبع جولات التمويل والمستثمرين لحظياً" },
        { icon: Radar, title: "استشارات تنفيذية احترافية", desc: "موجزات استخباراتية مهيكلة لصناع القرار" },
      ]
    : [
        { icon: Brain, title: "Sovereign Market Intelligence", desc: "Realtime strategic analysis built on live MENA data" },
        { icon: Shield, title: "Anti-Hallucination Architecture", desc: "Responses grounded exclusively in live intelligence" },
        { icon: Database, title: "Capital Flow Intelligence", desc: "Track funding rounds and momentum in realtime" },
        { icon: Radar, title: "Executive Strategic Briefings", desc: "Professional intelligence for decision-makers" },
      ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background flex items-center justify-center">
      <div className="max-w-5xl w-full mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-5">{isRTL ? "عقل قراءة" : "QIRAA MIND"}</h1>
        <div className="grid md:grid-cols-2 gap-6 mb-12 text-start">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-4 p-6 rounded-2xl border bg-card">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center"><f.icon className="h-5 w-5 text-primary" /></div>
              <div><h3 className="font-semibold">{f.title}</h3><p className="text-sm text-muted-foreground">{f.desc}</p></div>
            </div>
          ))}
        </div>
        <Button size="lg" onClick={onLogin}>{isRTL ? "تسجيل الدخول" : "Sign In"}</Button>
      </div>
    </div>
  );
};

const QiraaMindPage = () => {
  const { isRTL, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // حالة زر التقرير المطول
  const [isDeepDive, setIsDeepDive] = useState(false);
  
  const [connectionState, setConnectionState] = useState<"idle" | "connecting" | "streaming">("idle");
  const [tokensLeft, setTokensLeft] = useState<number | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedFileContent, setAttachedFileContent] = useState("");
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [fileProcessingState, setFileProcessingState] = useState("");

  const outputRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingContentRef = useRef("");
  const streamFlushIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pendingChunkRef = useRef("");

  // ... (تم اختصار الدوال المساعدة مثل handleMicClick و handleFileSelect للحفاظ على المساحة، يرجى الاحتفاظ بها كما كانت)

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = { role: "user", content: messageText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setIsAnalyzing(true);
    setConnectionState("connecting");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // إرسال المتغير الجديد للخادم
      const body: any = {
        messages: newMessages,
        is_deep_dive: isDeepDive, 
        user_file: attachedFileContent ? { name: attachedFile?.name, content: attachedFileContent } : undefined
      };

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": session?.access_token || "",
        },
        body: JSON.stringify(body),
      });

      if (!resp.ok) throw new Error("Connection failed");

      setConnectionState("streaming");
      await processStreamingResponse(resp);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
      setConnectionState("idle");
    }
  };

  // ... (باقي الدوال المنطقية تبقى كما هي)

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background flex flex-col">
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 flex flex-col">
        {/* ... (عرض الرسائل يبقى كما هو) ... */}
        
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="w-full max-w-3xl mx-auto">
          <div className="relative rounded-2xl bg-card border border-border">
            <div className="flex items-end gap-2 px-4 py-3">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-10 h-10 rounded-xl border flex items-center justify-center text-muted-foreground">
                <Paperclip className="h-5 w-5" />
              </button>

              {/* زر التقرير المطول (Dive Deep) */}
              <button
                type="button"
                onClick={() => setIsDeepDive(!isDeepDive)}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                  isDeepDive ? "bg-primary/20 text-primary border-primary" : "text-muted-foreground border-border"
                }`}
                title="Toggle Deep Dive Mode"
              >
                <Sparkles className={`h-5 w-5 ${isDeepDive ? "animate-pulse" : ""}`} />
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent py-2 resize-none outline-none"
                placeholder={isRTL ? "اسأل عقل قراءة..." : "Ask QIRAA Mind..."}
              />
              
              <button type="submit" className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center">
                <ArrowUp className="h-5 w-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QiraaMindPage;
