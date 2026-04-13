import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";

const PaymentPending = () => {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
            <Clock className="h-10 w-10 text-amber-500" />
          </div>
          <CardTitle className="text-2xl">
            {isRTL ? "تم استلام طلبك" : "Payment Pending"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {isRTL
              ? "يرجى إتمام عملية الدفع من خلال الطريقة التي اخترتها (فوري / أمان / بساطة). سيتم تفعيل اشتراكك تلقائياً فور تأكيد الدفع."
              : "Please complete your payment through the method you selected (Fawry / Aman / Basata). Your subscription will be activated automatically once payment is confirmed."}
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              {isRTL ? "الذهاب إلى لوحة التحكم" : "Go to Dashboard"}
            </Button>
            <Button variant="outline" onClick={() => navigate("/pricing")} className="w-full">
              {isRTL ? "العودة للباقات" : "Back to Pricing"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPending;
