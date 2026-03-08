import { useLanguage } from "@/hooks/useLanguage";

const TermsOfUse = () => {
  const { isRTL } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-foreground mb-8">
        {isRTL ? "شروط الاستخدام" : "Terms of Use"}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        {isRTL ? "آخر تحديث: 8 مارس 2026" : "Last updated: March 8, 2026"}
      </p>

      <div className="prose prose-lg max-w-none dark:prose-invert space-y-6 text-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "1. قبول الشروط" : "1. Acceptance of Terms"}</h2>
          <p>{isRTL
            ? "باستخدامك لمنصة قراءة (QIRAA)، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا لم توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة."
            : "By using QIRAA platform, you agree to be bound by these terms and conditions. If you do not agree to any of these terms, please do not use the platform."
          }</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "2. وصف الخدمة" : "2. Service Description"}</h2>
          <p>{isRTL
            ? "قراءة هي منصة ذكاء اسواق لحظية توفر تحليلات استراتيجية، مؤشرات سوقية، تقارير متخصصة، ومحلل استراتيجي ذكي (عقل قراءة) لمنطقة الشرق الأوسط وشمال أفريقيا. الخدمة مقدمة عبر نظام اشتراكات متعدد المستويات."
            : "QIRAA is a real-time market intelligence platform providing strategic analyses, market indicators, specialized reports, and an AI strategic analyst (QIRAA Mind) for the MENA region. The service is offered through a multi-tier subscription system."
          }</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "3. حسابات المستخدمين" : "3. User Accounts"}</h2>
          <ul className="list-disc pr-6 pl-6 space-y-2">
            <li>{isRTL ? "يجب أن تكون المعلومات المقدمة عند التسجيل دقيقة وحديثة" : "Information provided during registration must be accurate and current"}</li>
            <li>{isRTL ? "أنت مسؤول عن الحفاظ على سرية بيانات حسابك" : "You are responsible for maintaining the confidentiality of your account credentials"}</li>
            <li>{isRTL ? "يُحظر مشاركة حسابك مع أشخاص آخرين" : "Sharing your account with others is prohibited"}</li>
            <li>{isRTL ? "يجب إبلاغنا فوراً عن أي استخدام غير مصرح به لحسابك" : "You must notify us immediately of any unauthorized use of your account"}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "4. الاشتراكات والمدفوعات" : "4. Subscriptions & Payments"}</h2>
          <ul className="list-disc pr-6 pl-6 space-y-2">
            <li>{isRTL ? "تتجدد الاشتراكات تلقائياً ما لم يتم إلغاؤها قبل تاريخ التجديد" : "Subscriptions auto-renew unless canceled before the renewal date"}</li>
            <li>{isRTL ? "جميع الباقات تشمل ضمان استرداد المال خلال 30 يوماً" : "All plans include a 30-day money-back guarantee"}</li>
            <li>{isRTL ? "لكل باقة حدود استخدام محددة (عدد المقالات، التوكنز) يجب الالتزام بها" : "Each plan has specific usage limits (articles, tokens) that must be adhered to"}</li>
            <li>{isRTL ? "يحق لنا تعديل الأسعار مع إشعار مسبق بـ 30 يوماً" : "We reserve the right to modify pricing with 30 days prior notice"}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "5. الاستخدام المقبول" : "5. Acceptable Use"}</h2>
          <ul className="list-disc pr-6 pl-6 space-y-2">
            <li>{isRTL ? "يُحظر إعادة نشر أو بيع محتوى المنصة دون إذن كتابي" : "Republishing or selling platform content without written permission is prohibited"}</li>
            <li>{isRTL ? "يُحظر استخدام أدوات آلية لجمع البيانات (scraping)" : "Using automated tools for data scraping is prohibited"}</li>
            <li>{isRTL ? "يُحظر محاولة الوصول غير المصرح به لأنظمة المنصة" : "Attempting unauthorized access to platform systems is prohibited"}</li>
            <li>{isRTL ? "يُحظر استخدام المنصة لأي أغراض غير قانونية" : "Using the platform for any illegal purposes is prohibited"}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "6. الملكية الفكرية" : "6. Intellectual Property"}</h2>
          <p>{isRTL
            ? "جميع المحتويات والتحليلات والتقارير والبيانات المعروضة على المنصة هي ملكية فكرية لقراءة. يُمنح المستخدم ترخيصاً محدوداً وغير حصري للاستخدام الشخصي وفقاً لباقته."
            : "All content, analyses, reports, and data displayed on the platform are intellectual property of QIRAA. Users are granted a limited, non-exclusive license for personal use according to their subscription plan."
          }</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "7. إخلاء المسؤولية" : "7. Disclaimer"}</h2>
          <p>{isRTL
            ? "المعلومات والتحليلات المقدمة على المنصة هي لأغراض إعلامية فقط ولا تشكل نصيحة استثمارية. قراءة غير مسؤولة عن أي قرارات استثمارية تُتخذ بناءً على محتوى المنصة. جميع بيانات المبيعات والإيرادات تقديرية."
            : "Information and analyses provided on the platform are for informational purposes only and do not constitute investment advice. QIRAA is not responsible for any investment decisions made based on platform content. All sales and revenue data are estimates."
          }</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "8. إنهاء الخدمة" : "8. Termination"}</h2>
          <p>{isRTL
            ? "يحق لنا تعليق أو إنهاء حسابك في حالة انتهاك هذه الشروط. يحق لك إلغاء حسابك في أي وقت من خلال إعدادات الحساب أو التواصل معنا."
            : "We reserve the right to suspend or terminate your account in case of violation of these terms. You may cancel your account at any time through account settings or by contacting us."
          }</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">{isRTL ? "9. التواصل" : "9. Contact"}</h2>
          <p>{isRTL
            ? "لأي استفسارات تتعلق بشروط الاستخدام، يرجى التواصل معنا عبر: contact@qiraabusiness.online"
            : "For any inquiries regarding these terms, please contact us at: contact@qiraabusiness.online"
          }</p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfUse;
