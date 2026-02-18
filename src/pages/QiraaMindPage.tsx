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
    <div className="min-h-screen" style={{ background: "#050505" }}>
      {/* Technical grid overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-2">
          <div className="inline-flex items-center gap-2 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-4" style={{ background: "rgba(16,185,129,0.05)" }}>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 text-xs font-mono tracking-wider uppercase">
              {isRTL ? "نشط • Q4 2025" : "LIVE • Q4 2025 INDEX"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
            QIRAA MIND
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {isRTL
              ? "محرك ذكاء سوقي استراتيجي • بيانات Q4 2025 • MENA"
              : "Strategic Market Intelligence Engine • Q4 2025 Data • MENA"
            }
          </p>
        </div>

        {/* Search Bar - Center Stage */}
        <div className={`${hasMessages ? "mb-6" : "mt-16 mb-8"} transition-all duration-500`}>
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="relative"
          >
            <div className="relative border border-gray-800 rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isRTL ? "...اسأل QIRAA MIND عن تحركات السوق" : "Ask QIRAA MIND about market signals..."}
                disabled={isLoading}
                className="w-full bg-transparent text-white placeholder-gray-600 px-6 py-5 text-lg outline-none"
                style={{ fontFamily: "'Inter', sans-serif", direction: isRTL ? "rtl" : "ltr" }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                style={{
                  right: isRTL ? "auto" : "12px",
                  left: isRTL ? "12px" : "auto",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                }}
              >
                {isLoading ? <Loader2 className="h-5 w-5 text-white animate-spin" /> : <Send className="h-5 w-5 text-white" />}
              </button>
            </div>
          </form>
        </div>

        {/* Power Queries - Only show when no messages */}
        {!hasMessages && (
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {powerQueries.map((q) => (
              <button
                key={q.label}
                onClick={() => sendMessage(q.query)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-800 text-gray-400 text-sm hover:border-emerald-500/40 hover:text-emerald-400 transition-all"
                style={{ background: "rgba(255,255,255,0.02)", fontFamily: "'Inter', sans-serif" }}
              >
                <q.icon className="h-4 w-4" />
                {q.label}
              </button>
            ))}
          </div>
        )}

        {/* Output Area - Intelligence Briefs */}
        {hasMessages && (
          <div ref={outputRef} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 pb-4 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === "user" ? (
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", fontFamily: "monospace" }}>
                      Q
                    </div>
                    <p className="text-gray-300 text-sm pt-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {msg.content}
                    </p>
                  </div>
                ) : (
                  <div className="border border-gray-800/60 rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.015)" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-emerald-400 text-xs font-mono uppercase tracking-wider">
                        {isRTL ? "موجز استخباراتي" : "INTELLIGENCE BRIEF"}
                      </span>
                      {isLoading && i === messages.length - 1 && (
                        <Loader2 className="h-3 w-3 text-emerald-500 animate-spin" />
                      )}
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none prose-headings:font-mono prose-headings:text-emerald-400 prose-strong:text-white prose-li:text-gray-300 prose-p:text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <ReactMarkdown>{msg.content || "..."}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-700 text-xs font-mono">
            {isRTL
              ? "النموذج: Google Gemini 3 Flash • البوابة: Lovable AI Gateway • البيانات: Q4 2025"
              : "Model: Google Gemini 3 Flash • Gateway: Lovable AI Gateway • Data: Q4 2025"
            }
          </p>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default QiraaMindPage;
