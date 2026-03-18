import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";

const PaymentFail = () => {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
          <CardTitle className="text-2xl">
            {isRTL ? "فشلت عملية الدفع" : "Payment Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {isRTL
              ? "عذراً، لم تتم عملية الدفع بنجاح. يرجى التحقق من بيانات الدفع والمحاولة مرة أخرى."
              : "Sorry, the payment was not successful. Please check your payment details and try again."}
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate("/pricing")} className="w-full">
              {isRTL ? "المحاولة مرة أخرى" : "Try Again"}
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} className="w-full">
              {isRTL ? "الصفحة الرئيسية" : "Home Page"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFail;
