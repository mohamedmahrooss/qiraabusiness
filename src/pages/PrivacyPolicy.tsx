import { useLanguage } from "@/hooks/useLanguage";

const PrivacyPolicy = () => {
  const { isRTL } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-foreground mb-8">
        {isRTL ? "سياسة الخصوصية" : "Privacy Policy"}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        {isRTL ? "آخر تحديث: 8 مارس 2026" : "Last updated: March 8, 2026"}
      </p>

      <div className="prose prose-lg max-w-none dark:prose-invert space-y-6 text-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "1. مقدمة" : "1. Introduction"}</h2>
          <p>{isRTL
            ? "مرحباً بك في قراءة (QIRAA)، منصة ذكاء الاسواق اللحظية المتخصصة في منطقة الشرق الأوسط وشمال أفريقيا. نحن نلتزم بحماية خصوصيتك وبياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية بياناتك عند استخدام منصتنا."
            : "Welcome to QIRAA, a real-time market intelligence platform specializing in the Middle East and North Africa region. We are committed to protecting your privacy and personal data. This policy explains how we collect, use, and protect your data when using our platform."
          }</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "2. البيانات التي نجمعها" : "2. Data We Collect"}</h2>
          <ul className="list-disc pr-6 pl-6 space-y-2">
            <li>{isRTL ? "بيانات الحساب: الاسم الكامل، البريد الإلكتروني، كلمة المرور المشفرة" : "Account data: Full name, email address, encrypted password"}</li>
            <li>{isRTL ? "بيانات الاشتراك: خطة الاشتراك، تاريخ البدء والانتهاء، سجل المدفوعات" : "Subscription data: Plan type, start/end dates, payment history"}</li>
            <li>{isRTL ? "بيانات الاستخدام: المقالات المقروءة، التقارير المحملة، استعلامات عقل قراءة" : "Usage data: Articles read, reports downloaded, QIRAA Mind queries"}</li>
            <li>{isRTL ? "بيانات تقنية: عنوان IP، نوع المتصفح، نظام التشغيل، بيانات الكوكيز" : "Technical data: IP address, browser type, operating system, cookie data"}</li>
            <li>{isRTL ? "بيانات التحليلات: سلوك التصفح، الصفحات الأكثر زيارة، مدة الجلسة" : "Analytics data: Browsing behavior, most visited pages, session duration"}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "3. كيفية استخدام بياناتك" : "3. How We Use Your Data"}</h2>
          <ul className="list-disc pr-6 pl-6 space-y-2">
            <li>{isRTL ? "تقديم خدمات المنصة وتحسينها" : "Provide and improve platform services"}</li>
            <li>{isRTL ? "إدارة حسابك واشتراكك" : "Manage your account and subscription"}</li>
            <li>{isRTL ? "تخصيص التحليلات والتوصيات بناءً على اهتماماتك" : "Personalize analyses and recommendations based on your interests"}</li>
            <li>{isRTL ? "إرسال إشعارات مهمة وتحديثات السوق" : "Send important notifications and market updates"}</li>
            <li>{isRTL ? "تحليل أنماط الاستخدام لتحسين تجربة المستخدم" : "Analyze usage patterns to improve user experience"}</li>
            <li>{isRTL ? "الامتثال للمتطلبات القانونية والتنظيمية" : "Comply with legal and regulatory requirements"}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "4. حماية البيانات" : "4. Data Protection"}</h2>
          <p>{isRTL
            ? "نستخدم تشفير SSL/TLS لحماية البيانات أثناء النقل، ونخزن البيانات في خوادم آمنة مع تشفير على مستوى قاعدة البيانات. نطبق سياسات أمان صارمة للوصول (Row Level Security) لضمان أن كل مستخدم لا يمكنه الوصول إلا إلى بياناته الخاصة."
            : "We use SSL/TLS encryption to protect data in transit and store data on secure servers with database-level encryption. We implement strict Row Level Security policies to ensure each user can only access their own data."
          }</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "5. مشاركة البيانات" : "5. Data Sharing"}</h2>
          <p>{isRTL
            ? "لا نبيع بياناتك الشخصية لأي طرف ثالث. قد نشارك بيانات مجهولة الهوية مع شركائنا لأغراض تحليلية. نستخدم خدمات طرف ثالث موثوقة مثل Supabase للبنية التحتية و بوابات الدفع لمعالجة المدفوعات."
            : "We do not sell your personal data to any third party. We may share anonymized data with partners for analytical purposes. We use trusted third-party services like Supabase for infrastructure and payment gateways for processing payments."
          }</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "6. حقوقك" : "6. Your Rights"}</h2>
          <ul className="list-disc pr-6 pl-6 space-y-2">
            <li>{isRTL ? "الوصول إلى بياناتك الشخصية وتصديرها" : "Access and export your personal data"}</li>
            <li>{isRTL ? "تصحيح البيانات غير الدقيقة" : "Correct inaccurate data"}</li>
            <li>{isRTL ? "طلب حذف حسابك وبياناتك" : "Request deletion of your account and data"}</li>
            <li>{isRTL ? "الاعتراض على معالجة بياناتك" : "Object to data processing"}</li>
            <li>{isRTL ? "إلغاء الاشتراك في الاتصالات التسويقية" : "Opt out of marketing communications"}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "7. الاحتفاظ بالبيانات" : "7. Data Retention"}</h2>
          <p>{isRTL
            ? "نحتفظ ببياناتك طالما كان حسابك نشطاً. عند حذف حسابك، سنقوم بحذف بياناتك الشخصية خلال 30 يوماً، باستثناء البيانات المطلوبة قانونياً."
            : "We retain your data as long as your account is active. Upon account deletion, we will delete your personal data within 30 days, except for legally required data."
          }</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "8. التواصل معنا" : "8. Contact Us"}</h2>
          <p>{isRTL
            ? "لأي استفسارات تتعلق بالخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني: contact@qiraabusiness.online"
            : "For any privacy-related inquiries, please contact us at: contact@qiraabusiness.online"
          }</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
