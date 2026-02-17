import QiraaMind from "@/components/QiraaMind";
import { useLanguage } from "@/hooks/useLanguage";
import { Brain } from "lucide-react";

const QiraaMindPage = () => {
  const { isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-primary text-sm">
            <Brain className="h-4 w-4" />
            <span>{isRTL ? "مدعوم بالذكاء الاصطناعي" : "Powered by AI"}</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {isRTL ? "عقل قراءة" : "QIRAA Mind"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isRTL 
              ? "محلل استراتيجي متخصص في بيئة الشركات الناشئة في منطقة الشرق الأوسط وشمال أفريقيا. اسألني عن تحركات السوق والفرص الاستثمارية."
              : "Strategic analyst specialized in the MENA startup ecosystem. Ask me about market movements and investment opportunities."
            }
          </p>
          <p className="text-sm text-muted-foreground">
            {isRTL 
              ? "النموذج المستخدم: Google Gemini 3 Flash | البيانات: تقارير Q4 2025"
              : "Model: Google Gemini 3 Flash | Data: Q4 2025 Reports"
            }
          </p>
        </div>

        <QiraaMind />
      </div>
    </div>
  );
};

export default QiraaMindPage;
