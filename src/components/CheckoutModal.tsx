import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, Smartphone, Store, Wallet, Banknote } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: string;
  planName: string;
  isAnnual: boolean;
  price: number;
  currency: string;
  isEgyptian: boolean;
}

const PAYMENT_METHODS = [
  { id: 2, label: { ar: "بطاقة ائتمان / خصم", en: "Credit/Debit Card" }, icon: CreditCard, egyptOnly: false },
  { id: 3, label: { ar: "فوري", en: "Fawry" }, icon: Store, egyptOnly: true },
  { id: 11, label: { ar: "محافظ إلكترونية", en: "Mobile Wallets" }, icon: Smartphone, egyptOnly: true },
  { id: 14, label: { ar: "أمان", en: "Aman" }, icon: Wallet, egyptOnly: true },
  { id: 15, label: { ar: "بساطة / مصاري", en: "Basata / Masary" }, icon: Banknote, egyptOnly: true },
];

const CheckoutModal = ({
  open, onOpenChange, planId, planName, isAnnual, price, currency, isEgyptian,
}: CheckoutModalProps) => {
  const { isRTL } = useLanguage();
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(2);
  const [loading, setLoading] = useState(false);

  const availableMethods = PAYMENT_METHODS.filter(m => isEgyptian || !m.egyptOnly);

  const validatePhone = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    if (!cleaned) return isRTL ? "رقم الهاتف مطلوب" : "Phone number is required";
    if (cleaned.length < 8 || cleaned.length > 15) return isRTL ? "رقم هاتف غير صالح" : "Invalid phone number";
    if (!/^[+\d]+$/.test(cleaned)) return isRTL ? "أرقام فقط" : "Numbers only";
    return "";
  };

  const handleSubmit = async () => {
    const error = validatePhone(phone);
    if (error) {
      setPhoneError(error);
      return;
    }
    setPhoneError("");
    setLoading(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("fawaterak-checkout", {
        body: {
          planId,
          isAnnual,
          paymentMethodId: selectedMethod,
          userPhone: phone.replace(/\s/g, ""),
        },
      });

      if (fnError) throw fnError;

      if (data?.error_code === "PHONE_REQUIRED") {
        setPhoneError(data.message || (isRTL ? "رقم الهاتف مطلوب" : "Phone number is required"));
        return;
      }

      if (data?.payment_url) {
        window.location.href = data.payment_url;
      } else {
        throw new Error("No payment URL returned");
      }
    } catch (e: any) {
      const msg = e?.message || "";
      if (msg.includes("403") || msg.includes("Access Denied")) {
        toast.error(isRTL ? "هذه الميزة متاحة لباقات Pro و Enterprise فقط" : "This feature is available for Pro and Enterprise plans only");
      } else {
        toast.error(isRTL ? "حدث خطأ، يرجى المحاولة مرة أخرى" : "An error occurred, please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isRTL ? "إتمام عملية الدفع" : "Complete Payment"}</DialogTitle>
          <DialogDescription>
            {planName} — {currency} {price}
            {isAnnual && planId !== "topup" ? (isRTL ? " / سنة" : " / year") : planId === "topup" ? "" : (isRTL ? " / شهر" : " / month")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">{isRTL ? "رقم الهاتف" : "Phone Number"} *</Label>
            <Input
              id="phone"
              type="tel"
              dir="ltr"
              placeholder="+20 1000000000"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setPhoneError(""); }}
              className={phoneError ? "border-destructive" : ""}
            />
            {phoneError && <p className="text-xs text-destructive">{phoneError}</p>}
          </div>

          {/* Payment methods */}
          <div className="space-y-2">
            <Label>{isRTL ? "طريقة الدفع" : "Payment Method"}</Label>
            <div className="grid gap-2">
              {availableMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-start w-full ${
                      selectedMethod === method.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">
                      {isRTL ? method.label.ar : method.label.en}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full" size="lg">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              isRTL ? "ادفع الآن" : "Pay Now"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            {isRTL
              ? "سيتم تحويلك إلى بوابة الدفع الآمنة لإتمام العملية"
              : "You will be redirected to the secure payment gateway"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
