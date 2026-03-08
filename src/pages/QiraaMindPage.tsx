import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Zap, TrendingUp, Globe, Leaf, Copy, Check, Brain, Shield, BarChart3, Sparkles, Lock, ArrowUp, Plus, Mic } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type Message = { role: "user" | "assistant" | "system"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/qiraa-mind`;

// Radiant gradient CSS for the input — exact match from the prompt component
const radiantStyles = `
@property --rotation {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

@keyframes rotate-gradient {
  to {
    --rotation: 360deg;
  }
}

.radiant-input-wrapper {
  --border-size: 3px;
  --gradient: conic-gradient(
    from var(--rotation) 
    at 50% 50% in oklab, 
    oklch(0.63 0.2 251.22) 27%, 
    oklch(0.67 0.21 25.81) 33%, 
    oklch(0.9 0.19 93.93) 41%, 
    oklch(0.79 0.25 150.49) 49%, 
    oklch(0.63 0.2 251.22) 65%, 
    oklch(0.72 0.21 150.89) 93%, 
    oklch(0.63 0.2 251.22)
  );
  animation: rotate-gradient 5s infinite linear;
}

/* The glowing border effect */
.radiant-input-wrapper::before {
  content: '';
  position: absolute;
  inset: calc(var(--border-size) * -1);
  border-radius: inherit;
  background: var(--gradient);
  z-index: -1;
  filter: blur(8px);
  opacity: 0.6;
}

/* The sharp border mask */
.radiant-input-border {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: var(--border-size);
  background: var(--gradient);
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

@keyframes pulse-mic {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
}

.mic-recording {
  animation: pulse-mic 1.5s ease-in-out infinite;
}
`;

// Landing page for unauthenticated users
const QiraaMindLanding = ({ isRTL, onLogin }: { isRTL: boolean; onLogin: () => void }) => {
  const features = isRTL
    ? [
        { icon: Brain, title: "تحليل استراتيجي بالذكاء الاصطناعي", desc: "محرك تحليل مبني على بيانات المنصة الحية لتقديم رؤى دقيقة للمستثمرين والمؤسسين" },
        { icon: Shield, title: "بيانات موثوقة ومحدثة", desc: "جميع الإجابات مستندة حصرياً على تحليلات المنصة المنشورة في آخر 3 أشهر" },
        { icon: BarChart3, title: "تقارير تنفيذية احترافية", desc: "إجابات بأسلوب الموجز الاستراتيجي مع أرقام دقيقة وتوصيات عملية" },
        { icon: Sparkles, title: "أسئلة ذكية جاهزة", desc: "استعلامات سريعة معدّة مسبقاً لتحليل القطاعات والاتجاهات والصفقات" },
      ]
    : [
        { icon: Brain, title: "AI-Powered Strategic Analysis", desc: "An analysis engine built on live platform data to deliver precise insights for investors and founders" },
        { icon: Shield, title: "Trusted & Up-to-Date Data", desc: "All answers are based exclusively on platform analyses published in the last 3 months" },
        { icon: BarChart3, title: "Executive-Grade Reports", desc: "Responses in strategic briefing style with precise figures and actionable recommendations" },
        { icon: Sparkles, title: "Ready-Made Power Queries", desc: "Pre-built quick queries to analyze sectors, trends, and deals instantly" },
      ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 border border-primary/20 rounded-full px-4 py-1.5 mb-6 bg-primary/5">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-primary text-xs font-mono tracking-wider uppercase">
            {isRTL ? "مستشار ذكاء الاعمال الاستراتيجي" : "STRATEGIC BUSINESS INTELLIGENCE ADVISOR"}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
          {isRTL ? "عقل قراءة" : "QIRAA MIND"}
        </h1>

        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
          {isRTL
            ? "سجّل دخولك للوصول إلى محرك التحليل الاستراتيجي المدعوم بالذكاء الاصطناعي"
            : "Sign in to access the AI-powered strategic analysis engine"}
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12 text-start">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={onLogin} className="text-base px-8">
            {isRTL ? "تسجيل الدخول" : "Sign In"}
          </Button>
          <Button size="lg" variant="outline" onClick={onLogin} className="text-base px-8">
            {isRTL ? "إنشاء حساب جديد" : "Create Account"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Voice recognition hook using Web Speech API
const useVoiceInput = (language: string) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return false;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';

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

  return { isListening, transcript, startListening, stopListening, setTranscript };
};

const QiraaMindPage = () => {
  const { isRTL, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokensLeft, setTokensLeft] = useState<number | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isListening, transcript, startListening, stopListening, setTranscript } = useVoiceInput(language);

  // Sync voice transcript to input
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  // Check auth, access & fetch tokens
  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin');
      const isAdmin = roles && roles.length > 0;

      const { data } = await supabase
        .from('profiles')
        .select('qiraa_mind_tokens, subscription_plan')
        .eq('user_id', session.user.id)
        .maybeSingle();
      if (data) {
        setTokensLeft(data.qiraa_mind_tokens ?? 0);
        if (isAdmin) {
          setHasAccess(true);
        } else {
          const plan = data.subscription_plan?.toLowerCase() || 'free';
          setHasAccess(['pro', 'enterprise'].includes(plan));
        }
      } else {
        setHasAccess(isAdmin ? true : false);
      }
    };
    check();
  }, [isLoading]);

  const saveMessageToHistory = async (role: string, content: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        await supabase.from('qiraa_mind_history').insert({
          user_id: session.user.id,
          role,
          content,
          session_id: sessionId,
        });
      }
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({ title: isRTL ? "تم النسخ" : "Copied!", duration: 1500 });
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
          description: isRTL ? "المتصفح لا يدعم التعرف على الصوت. جرب Chrome." : "Your browser doesn't support speech recognition. Try Chrome.",
          variant: "destructive",
        });
      }
    }
  };

  const powerQueries = isRTL
    ? [
        { label: "تحليل اتجاهات Q4", query: "حلل أبرز اتجاهات الاستثمار في الربع الأخير من 2025 في منطقة الشرق الأوسط وشمال أفريقيا", icon: TrendingUp },
        { label: "مصر vs السعودية", query: "قارن بين بيئة الاستثمار في الشركات الناشئة في مصر والسعودية خلال Q4 2025", icon: Globe },
        { label: "أبرز صفقات AgriTech", query: "ما هي أبرز صفقات واستثمارات التكنولوجيا الزراعية في المنطقة؟", icon: Leaf },
        { label: "FinTech في المنطقة", query: "ما هو وضع قطاع التكنولوجيا المالية في الشرق الأوسط وشمال أفريقيا في الربع الأخير من 2025؟", icon: Zap },
      ]
    : [
        { label: "Analyze Q4 Trends", query: "Analyze the top investment trends in MENA region during Q4 2025", icon: TrendingUp },
        { label: "Egypt vs KSA", query: "Compare startup investment environments in Egypt vs Saudi Arabia during Q4 2025", icon: Globe },
        { label: "Top AgriTech Deals", query: "What are the top AgriTech deals and investments in the MENA region?", icon: Leaf },
        { label: "FinTech Overview", query: "What is the state of FinTech in MENA during Q4 2025?", icon: Zap },
      ];

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    // Stop listening if active
    if (isListening) stopListening();
    setTranscript("");

    if (tokensLeft !== null && tokensLeft <= 0) {
      toast({
        title: isRTL ? "نفد الرصيد" : "Out of tokens",
        description: isRTL ? "يرجى ترقية الباقة أو شراء توكنز إضافية." : "Please upgrade or buy more tokens.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = { role: "user", content: messageText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    await saveMessageToHistory("user", messageText);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          ...(session?.access_token ? { "x-auth-token": session.access_token } : {}),
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (resp.status === 402) {
        throw new Error(isRTL ? "الرصيد غير كافٍ. يرجى الشحن." : "Insufficient tokens.");
      }

      if (!resp.ok) {
        throw new Error("حدث خطأ في الاتصال بمحرك التحليل.");
      }

      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.trim() === "" || line.startsWith(":")) continue;
            if (line.startsWith("data: ")) {
              const dataStr = line.substring(6);
              if (dataStr === "[DONE]") break;

              try {
                const data = JSON.parse(dataStr);
                const delta = data.choices?.[0]?.delta?.content || "";
                if (delta) {
                  assistantContent += delta;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                    return updated;
                  });
                }
              } catch (e) {}
            }
          }
        }
      }

      if (assistantContent) {
        await saveMessageToHistory("assistant", assistantContent);
      }
    } catch (error: any) {
      const errMsg = error.message || "فشل الاتصال";
      setMessages((prev) => [
        ...prev.filter((m) => !(m.role === "assistant" && m.content === "")),
        { role: "assistant", content: `**تنبيه النظام:** ${errMsg}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Landing for unauthenticated
  if (!isAuthenticated) {
    return <QiraaMindLanding isRTL={isRTL} onLogin={() => navigate("/auth")} />;
  }

  // Access gate: only pro/enterprise
  if (hasAccess === false) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-background flex items-center justify-center">
        <div className="max-w-lg w-full mx-auto px-4 text-center space-y-6">
          <Lock className="h-16 w-16 text-primary/40 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">
            {isRTL ? "ميزة حصرية للباقات المتقدمة" : "Exclusive Feature"}
          </h2>
          <p className="text-muted-foreground text-base">
            {isRTL
              ? "عقل قراءة (Qiraa Mind) هو محرك ذكاء استراتيجي متاح فقط لمشتركي الباقة الاحترافية (Pro) والمؤسسية (Enterprise). قم بالترقية الآن للوصول إلى تحليلات عميقة."
              : "Qiraa Mind is a strategic intelligence engine available only to Pro and Enterprise subscribers. Upgrade now to access deep insights."}
          </p>
          <button
            onClick={() => navigate("/pricing")}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            {isRTL ? "ترقية الباقة الآن" : "Upgrade Plan Now"}
          </button>
        </div>
      </div>
    );
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background flex flex-col">
      <style>{radiantStyles}</style>
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col">

        {/* Messages Area */}
        {hasMessages && (
          <div ref={outputRef} className="flex-1 overflow-y-auto space-y-6 pb-4">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === "user" ? (
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold bg-primary/10 text-primary" style={{ fontFamily: "monospace" }}>
                      Q
                    </div>
                    <p className="text-foreground text-sm pt-1.5 whitespace-pre-wrap" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {msg.content}
                    </p>
                  </div>
                ) : (
                  <div className="border border-border rounded-2xl p-6 bg-card relative group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-primary text-xs font-mono uppercase tracking-wider">
                          {isRTL ? "موجز استخباراتي" : "INTELLIGENCE BRIEF"}
                        </span>
                        {isLoading && i === messages.length - 1 && (
                          <Loader2 className="h-3 w-3 text-primary animate-spin" />
                        )}
                      </div>
                      {msg.content && !isLoading && (
                        <button
                          onClick={() => copyToClipboard(msg.content, i)}
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
                    <div className="prose prose-sm max-w-none prose-headings:font-mono prose-headings:text-primary prose-strong:text-foreground prose-li:text-muted-foreground prose-p:text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <ReactMarkdown>{msg.content || "..."}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Input Area — centered when no messages */}
        <div className={`${hasMessages ? "mt-4" : "flex-1 flex flex-col items-center justify-center"} mb-2 w-full`}>
          {/* Radiant Prompt Input — exact match from the Component.tsx prompt */}
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="w-full max-w-2xl mx-auto">
            <div className="relative radiant-input-wrapper rounded-2xl">
              {/* Animated Gradient Border */}
              <div className="radiant-input-border rounded-2xl" />

              {/* Inner Content */}
              <div className="relative rounded-2xl bg-card/95 backdrop-blur-xl overflow-hidden">
                <div className="flex items-end gap-2 px-4 py-3">
                  {/* Add Button */}
                  <button
                    type="button"
                    className="flex-shrink-0 w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors mb-0.5"
                  >
                    <Plus className="h-5 w-5" />
                  </button>

                  {/* Text Input */}
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder={isRTL ? "اسأل قراءة" : "Ask QIRAA"}
                    disabled={isLoading}
                    rows={1}
                    className="flex-1 bg-transparent text-foreground placeholder-muted-foreground text-base outline-none resize-none max-h-[200px] py-2"
                    style={{ fontFamily: "'Inter', sans-serif", direction: isRTL ? "rtl" : "ltr" }}
                  />

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {/* Mic Button */}
                    <button
                      type="button"
                      onClick={handleMicClick}
                      className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        isListening
                          ? "bg-red-500 text-white mic-recording"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                      title={isRTL ? (isListening ? "إيقاف التسجيل" : "تحدث") : (isListening ? "Stop recording" : "Voice input")}
                    >
                      <Mic className="h-5 w-5" />
                    </button>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 bg-foreground text-background hover:bg-foreground/80"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <ArrowUp className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Power Queries - below input */}
          {!hasMessages && (
            <div className="flex flex-wrap justify-center gap-3 mt-6 max-w-2xl">
              {powerQueries.map((q) => (
                <button
                  key={q.label}
                  onClick={() => sendMessage(q.query)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-muted-foreground text-sm hover:border-primary/40 hover:text-primary transition-all bg-card"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <q.icon className="h-4 w-4" />
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
