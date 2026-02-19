import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Send, Loader2, Zap, TrendingUp, Globe, Leaf } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/qiraa-mind`;

const QiraaMindPage = () => {
  const { isRTL } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [messages]);

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

    const userMessage: Message = { role: "user", content: messageText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

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

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to get response");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantContent = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          const line = textBuffer.slice(0, newlineIndex).trim();
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") break;

          try {
            const parsed = JSON.parse(payload);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                return updated;
              });
            }
          } catch { /* partial JSON */ }
        }
      }
    } catch (error: any) {
      setMessages(prev => [
        ...prev.filter(m => !(m.role === "assistant" && m.content === "")),
        { role: "assistant", content: `// ERROR: ${error.message || "Connection failed"}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-2">
          <div className="inline-flex items-center gap-2 border border-primary/20 rounded-full px-4 py-1.5 mb-4 bg-primary/5">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-xs font-mono tracking-wider uppercase">
              {isRTL ? "نشط • Q4 2025" : "LIVE • Q4 2025 INDEX"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
            QIRAA MIND
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {isRTL
              ? "محرك ذكاء سوقي استراتيجي • بيانات Q4 2025 • MENA"
              : "Strategic Market Intelligence Engine • Q4 2025 Data • MENA"
            }
          </p>
        </div>

        {/* Search Bar */}
        <div className={`${hasMessages ? "mb-6" : "mt-16 mb-8"} transition-all duration-500`}>
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="relative">
            <div className="relative border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isRTL ? "...اسأل QIRAA MIND عن تحركات السوق" : "Ask QIRAA MIND about market signals..."}
                disabled={isLoading}
                className="w-full bg-transparent text-foreground placeholder-muted-foreground px-6 py-5 text-lg outline-none"
                style={{ fontFamily: "'Inter', sans-serif", direction: isRTL ? "rtl" : "ltr" }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 bg-primary hover:bg-primary/90"
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

        {/* Power Queries */}
        {!hasMessages && (
          <div className="flex flex-wrap justify-center gap-3 mb-16">
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

        {/* Output Area */}
        {hasMessages && (
          <div ref={outputRef} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 pb-4">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === "user" ? (
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold bg-primary/10 text-primary" style={{ fontFamily: "monospace" }}>
                      Q
                    </div>
                    <p className="text-foreground text-sm pt-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {msg.content}
                    </p>
                  </div>
                ) : (
                  <div className="border border-border rounded-2xl p-6 bg-card">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-primary text-xs font-mono uppercase tracking-wider">
                        {isRTL ? "موجز استخباراتي" : "INTELLIGENCE BRIEF"}
                      </span>
                      {isLoading && i === messages.length - 1 && (
                        <Loader2 className="h-3 w-3 text-primary animate-spin" />
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
      </div>
    </div>
  );
};

export default QiraaMindPage;
