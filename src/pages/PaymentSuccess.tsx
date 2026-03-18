import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";

const PaymentSuccess = () => {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect after 10 seconds
    const timer = setTimeout(() => navigate("/dashboard"), 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <CardTitle className="text-2xl">
            {isRTL ? "تمت عملية الدفع بنجاح! 🎉" : "Payment Successful! 🎉"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {isRTL
              ? "تم تفعيل اشتراكك بنجاح. يمكنك الآن الاستمتاع بجميع مزايا باقتك الجديدة."
              : "Your subscription has been activated. You can now enjoy all features of your new plan."}
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              {isRTL ? "الذهاب إلى لوحة التحكم" : "Go to Dashboard"}
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} className="w-full">
              {isRTL ? "الصفحة الرئيسية" : "Home Page"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {isRTL ? "سيتم توجيهك تلقائياً خلال 10 ثوانٍ..." : "You will be redirected in 10 seconds..."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
