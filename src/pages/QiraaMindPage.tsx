import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Send, Loader2, Zap, TrendingUp, Globe, Leaf, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";

type Message = { role: "user" | "assistant" | "system"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/qiraa-mind`;

const QiraaMindPage = () => {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokensLeft, setTokensLeft] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [sessionId] = useState(() => crypto.randomUUID());
  const outputRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  // Fetch tokens
  useEffect(() => {
    const fetchTokens = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('qiraa_mind_tokens')
          .eq('user_id', session.user.id)
          .single();
        if (data) setTokensLeft((data as any).qiraa_mind_tokens);
      }
    };
    fetchTokens();
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

  const powerQueries = isRTL
    ? [
        { label: "تحليل اتجاهات Q4", query: "حلل أبرز اتجاهات الاستثمار في الربع الأخير من 2025 في منطقة الشرق الأوسط وشمال أفريقيا", icon: TrendingUp },
        { label: "شركات تحتاج لتوظيف", query: "بناءً على التحليلات الأخيرة، اذكر لي قائمة بأسماء الشركات التي ستحتاج لتوظيف وتوريد عمالة قريباً.", icon: Globe },
        { label: "أبرز صفقات AgriTech", query: "ما هي أبرز صفقات واستثمارات التكنولوجيا الزراعية في المنطقة؟", icon: Leaf },
        { label: "FinTech في المنطقة", query: "ما هو وضع قطاع التكنولوجيا المالية في الشرق الأوسط وشمال أفريقيا؟", icon: Zap },
      ]
    : [
        { label: "Analyze Q4 Trends", query: "Analyze the top investment trends in MENA region during Q4 2025", icon: TrendingUp },
        { label: "Hiring Opportunities", query: "Based on recent analyses, list companies likely to need hiring soon.", icon: Globe },
        { label: "Top AgriTech Deals", query: "What are the top AgriTech deals and investments in the MENA region?", icon: Leaf },
        { label: "FinTech Overview", query: "What is the state of FinTech in MENA?", icon: Zap },
      ];

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

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

    // Save user message to history
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
        throw new Error(isRTL ? "رصيد الأسئلة لا يسمح. يرجى الشحن." : "Insufficient tokens.");
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

      // Save assistant response to history
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

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background flex flex-col">
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 border border-primary/20 rounded-full px-4 py-1.5 mb-3 bg-primary/5">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-xs font-mono tracking-wider uppercase">
              {isRTL ? "مستشار الذكاء الاستراتيجي" : "STRATEGIC AI ADVISOR"}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
            QIRAA MIND
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {isRTL
              ? "تحليل شامل مقيد ببيانات المنصة الحية • مدعوم بـ AI"
              : "Comprehensive Analysis tied to Live Data • Powered by AI"}
          </p>
          {tokensLeft !== null && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs font-mono text-muted-foreground">
              {isRTL ? `الرصيد المتبقي: ${tokensLeft} سؤال` : `Tokens left: ${tokensLeft}`}
            </div>
          )}
        </div>

        {/* Power Queries */}
        {!hasMessages && (
          <div className="flex flex-wrap justify-center gap-3 mb-8 mt-8">
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

        {/* Messages Area - takes remaining space */}
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
                          {isRTL ? "موجز استراتيجي" : "STRATEGIC BRIEFING"}
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

        {/* Input Area - pinned to bottom */}
        <div className={`${hasMessages ? "mt-4" : "mt-auto"} mb-2`}>
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="relative">
            <div className="relative border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
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
                placeholder={isRTL ? "...اسأل QIRAA عن التوصيات وقوائم الشركات" : "Ask QIRAA for recommendations and company lists..."}
                disabled={isLoading}
                rows={1}
                className="w-full bg-transparent text-foreground placeholder-muted-foreground px-6 py-4 pr-14 text-base outline-none resize-none max-h-[200px]"
                style={{ fontFamily: "'Inter', sans-serif", direction: isRTL ? "rtl" : "ltr" }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute bottom-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 bg-primary hover:bg-primary/90"
                style={{
                  right: isRTL ? "auto" : "12px",
                  left: isRTL ? "12px" : "auto",
                }}
              >
                {isLoading ? <Loader2 className="h-5 w-5 text-primary-foreground animate-spin" /> : <Send className="h-5 w-5 text-primary-foreground" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QiraaMindPage;
