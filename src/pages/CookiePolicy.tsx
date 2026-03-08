import { useLanguage } from "@/hooks/useLanguage";

const CookiePolicy = () => {
  const { isRTL } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-foreground mb-8">
        {isRTL ? "سياسة الكوكيز" : "Cookie Policy"}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        {isRTL ? "آخر تحديث: 8 مارس 2026" : "Last updated: March 8, 2026"}
      </p>

      <div className="prose prose-lg max-w-none dark:prose-invert space-y-6 text-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "1. ما هي الكوكيز؟" : "1. What Are Cookies?"}</h2>
          <p>{isRTL
            ? "الكوكيز هي ملفات نصية صغيرة يتم تخزينها على جهازك عند زيارة موقعنا. تساعدنا في تحسين تجربتك وتقديم خدمة أفضل."
            : "Cookies are small text files stored on your device when you visit our website. They help us improve your experience and provide better service."
          }</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "2. أنواع الكوكيز التي نستخدمها" : "2. Types of Cookies We Use"}</h2>
          
          <h3 className="text-lg font-medium mb-2">{isRTL ? "كوكيز ضرورية" : "Essential Cookies"}</h3>
          <p>{isRTL
            ? "ضرورية لتشغيل المنصة وتشمل: جلسة المصادقة (Supabase Auth)، تفضيلات اللغة، إعدادات الكوكيز نفسها."
            : "Required for platform operation, including: authentication session (Supabase Auth), language preferences, cookie settings themselves."
          }</p>

          <h3 className="text-lg font-medium mb-2 mt-4">{isRTL ? "كوكيز تحليلية" : "Analytics Cookies"}</h3>
          <p>{isRTL
            ? "تساعدنا في فهم كيفية استخدام المنصة لتحسين خدماتنا. تجمع بيانات مجهولة الهوية حول الصفحات الأكثر زيارة ومدة الجلسة."
            : "Help us understand how the platform is used to improve our services. They collect anonymized data about most visited pages and session duration."
          }</p>

          <h3 className="text-lg font-medium mb-2 mt-4">{isRTL ? "كوكيز وظيفية" : "Functional Cookies"}</h3>
          <p>{isRTL
            ? "تتذكر تفضيلاتك مثل اللغة المفضلة، وضع العرض (فاتح/داكن)، وإعدادات لوحة التحكم."
            : "Remember your preferences such as preferred language, display mode (light/dark), and dashboard settings."
          }</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "3. إدارة الكوكيز" : "3. Managing Cookies"}</h2>
          <p>{isRTL
            ? "يمكنك التحكم في الكوكيز من خلال إعدادات المتصفح الخاص بك. يمكنك حذف الكوكيز الموجودة أو رفض قبول كوكيز جديدة. ومع ذلك، قد يؤثر ذلك على بعض وظائف المنصة."
            : "You can control cookies through your browser settings. You can delete existing cookies or refuse to accept new ones. However, this may affect some platform functionality."
          }</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "4. الكوكيز المستخدمة تحديداً" : "4. Specific Cookies Used"}</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-3 text-start">{isRTL ? "الاسم" : "Name"}</th>
                  <th className="border border-border p-3 text-start">{isRTL ? "الغرض" : "Purpose"}</th>
                  <th className="border border-border p-3 text-start">{isRTL ? "المدة" : "Duration"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3 font-mono text-sm">sb-*-auth-token</td>
                  <td className="border border-border p-3">{isRTL ? "جلسة المصادقة" : "Authentication session"}</td>
                  <td className="border border-border p-3">{isRTL ? "7 أيام" : "7 days"}</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-mono text-sm">qiraa-language</td>
                  <td className="border border-border p-3">{isRTL ? "تفضيل اللغة" : "Language preference"}</td>
                  <td className="border border-border p-3">{isRTL ? "دائم" : "Persistent"}</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-mono text-sm">qiraa-cookie-consent</td>
                  <td className="border border-border p-3">{isRTL ? "حالة موافقة الكوكيز" : "Cookie consent status"}</td>
                  <td className="border border-border p-3">{isRTL ? "سنة واحدة" : "1 year"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "5. التواصل" : "5. Contact"}</h2>
          <p>{isRTL
            ? "لأي استفسارات تتعلق بسياسة الكوكيز، يرجى التواصل معنا عبر: contact@qiraabusiness.online"
            : "For any inquiries regarding this cookie policy, please contact us at: contact@qiraabusiness.online"
          }</p>
        </section>
      </div>
    </div>
  );
};

export default CookiePolicy;
