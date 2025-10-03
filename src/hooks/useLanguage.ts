import { useState, useEffect } from 'react';

interface LanguageState {
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  isRTL: boolean;
}

export const useLanguage = (): LanguageState => {
  const [language, setLanguageState] = useState<'ar' | 'en'>(() => {
    const saved = localStorage.getItem('qiraa-language');
    return (saved as 'ar' | 'en') || 'ar';
  });

  const setLanguage = (lang: 'ar' | 'en') => {
    setLanguageState(lang);
    localStorage.setItem('qiraa-language', lang);
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return {
    language,
    setLanguage,
    isRTL: language === 'ar'
  };
};

export const translations = {
  ar: {
    // Authentication
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب جديد',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    loginWithGoogle: 'تسجيل الدخول بواسطة Google',
    forgotPassword: 'نسيت كلمة المرور؟',
    termsAndConditions: 'الشروط والأحكام',
    privacyPolicy: 'سياسة الخصوصية',
    agreeToTerms: 'أوافق على',
    and: 'و',
    haveAccount: 'لديك حساب بالفعل؟',
    noAccount: 'ليس لديك حساب؟',
    signInHere: 'سجل دخولك هنا',
    createAccount: 'أنشئ حسابك هنا',
    welcomeBack: 'مرحباً بعودتك',
    joinQiraa: 'انضم إلى قيراء',
    accessPlatform: 'قم بالدخول للوصول إلى منصة قيراء للتحليلات الذكية',
    createNewAccount: 'أنشئ حساباً جديداً للاستفادة من خدماتنا المتميزة',
    
    // Validation messages
    required: 'هذا الحقل مطلوب',
    invalidEmail: 'البريد الإلكتروني غير صحيح',
    passwordTooShort: 'كلمة المرور يجب أن تكون على الأقل 6 أحرف',
    passwordsDontMatch: 'كلمات المرور غير متطابقة',
    nameRequired: 'الاسم الكامل مطلوب',
    
    // Success messages
    welcomeUser: 'مرحباً بك في قيراء!',
    accountCreated: 'تم إنشاء حسابك بنجاح',
    loginSuccess: 'تم تسجيل الدخول بنجاح',
    
    // Error messages
    loginError: 'خطأ في البريد الإلكتروني أو كلمة المرور',
    emailExists: 'البريد الإلكتروني مستخدم بالفعل',
    registrationError: 'حدث خطأ أثناء إنشاء الحساب',
    
    // Buttons
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    or: 'أو',

    // QIRAA Signals Page
    qiraaSignalsTitle: 'مؤشرات قراءة (QIRAA Signals)',
    qiraaSignalsSubtitle: 'مؤشرات المبيعات الذكية للشركات الناشئة',
    filtersControlPanel: 'لوحة التحكم والفلاتر',
    country: 'الدولة',
    selectCountry: 'اختر الدولة',
    mainSector: 'القطاع الرئيسي',
    selectSector: 'اختر القطاع',
    subSector: 'القطاع الفرعي',
    selectSubSector: 'اختر القطاع الفرعي',
    companyName: 'اسم الشركة',
    selectCompany: 'اختر الشركة',
    sectorAverage: 'متوسط أداء القطاع',
    monthlyView: 'نظرة شهرية',
    annualView: 'نظرة سنوية',
    selectMonthsComparison: 'اختيار الأشهر للمقارنة',
    selectFirstMonth: 'اختر الشهر الأول:',
    selectSecondMonth: 'اختر الشهر الثاني للمقارنة:',
    totalRevenue: 'إجمالي الإيرادات',
    totalSales: 'إجمالي المبيعات',
    monthlyGrowth: 'معدل النمو الشهري',
    dailyRevenue: 'الإيرادات اليومية (دولار أمريكي)',
    firstMonth: 'الشهر الأول:',
    secondMonth: 'الشهر الثاني:',
    change: 'التغيير:',
    selectYear: 'اختيار السنة',
    selectYearLabel: 'اختر السنة',
    totalAnnualRevenue: 'إجمالي الإيرادات السنوية',
    totalAnnualSales: 'إجمالي المبيعات السنوية',
    bestQuarter: 'أفضل ربع أداءً',
    yearOverYearGrowth: 'معدل النمو السنوي',
    annualTrend: 'الاتجاه السنوي للإيرادات',
    advancedAnalysis: 'أدوات تحليل متقدمة',
    companyBenchmarking: 'مقارنة الشركات',
    companyBenchmarkingDesc: 'اختر ما يصل إلى 3 شركات من نفس القطاع لمقارنة أدائها الشهري أو السنوي جنباً إلى جنب',
    selectCompaniesCompare: 'اختر الشركات للمقارنة',
    marketShareAnalysis: 'تحليل الحصة السوقية',
    marketShareDesc: 'اكتشف الحصة السوقية المقدرة للشركة داخل قطاعها الفرعي',
    exportData: 'تصدير البيانات',
    exportDataDesc: 'قم بتنزيل البيانات المحددة كملف CSV لتحليلاتك الخاصة',
    exportToCsv: 'تصدير إلى CSV',
    proFeature: 'ميزة متاحة في الخطة الاحترافية',
    selectedCompany: 'الشركة المختارة',
    competitors: 'المنافسون',
    totalRevenueTooltip: 'إجمالي الإيرادات المحققة خلال الشهر بالعملة المحلية',
    totalSalesTooltip: 'عدد المبيعات الإجمالي المحقق خلال الشهر',
    monthlyGrowthTooltip: 'النسبة المئوية للتغيير في الإيرادات مقارنة بالشهر السابق',
    quarterlyRevenue: 'الإيرادات الربع سنوية',
    exportDataDescription: 'قم بتنزيل البيانات المحددة كملف CSV لتحليلاتك الخاصة',
    
    // Footer translations
    quickLinks: 'روابط سريعة',
    home: 'الرئيسية',
    articles: 'المقالات',
    reports: 'التقارير الاستراتيجية',
    qiraaSignals: 'مؤشرات قراءة',
    pricing: 'الباقات والأسعار',
    about: 'من نحن',
    supportHelp: 'الدعم والمساعدة',
    helpCenter: 'مركز المساعدة',
    contactUs: 'تواصل معنا',
    api: 'واجهة API',
    privacyPolicyFooter: 'سياسة الخصوصية',
    termsOfUse: 'شروط الاستخدام',
    newsletter: 'اشترك في النشرة البريدية',
    newsletterDesc: 'احصل على أحدث الرؤى والتحليلات مباشرة في بريدك الإلكتروني',
    yourEmail: 'بريدك الإلكتروني',
    subscribe: 'اشتراك',
    allRightsReserved: 'جميع الحقوق محفوظة',
    cookiePolicy: 'سياسة الكوكيز',
    
    // Pricing page translations
    choosePlan: 'اختر الباقة المناسبة لك',
    pricingSubtitle: 'باقات مرنة تناسب جميع احتياجاتك الاستثمارية من البداية حتى المؤسسات الكبيرة',
    freePlan: 'المجانية',
    basicPlan: 'الأساسية',
    proPlan: 'الاحترافية',
    enterprisePlan: 'المؤسسية',
    freePlanDesc: 'للمبتدئين ورواد الأعمال الجدد',
    basicPlanDesc: 'للمستثمرين الأفراد والشركات الناشئة',
    proPlanDesc: 'للمستثمرين المحترفين والمؤسسات المتوسطة',
    enterprisePlanDesc: 'للمؤسسات الكبيرة وصناديق الاستثمار',
    monthlyPricing: 'شهرياً',
    annualPricing: 'سنوياً',
    mostPopular: 'الأكثر شعبية',
    getStarted: 'ابدأ مجاناً',
    subscribeNow: 'اشترك الآن',
    subscribeToPro: 'اشترك في الاحترافية',
    contactSales: 'تواصل معنا',
    moneyBackGuarantee: 'جميع الباقات تشمل ضمان استرداد المال خلال 30 يوماً',
    noSetupFees: 'بدون رسوم إعداد',
    cancelAnytime: 'إلغاء في أي وقت',
    instantSupport: 'دعم فني لحظي',
  },
  en: {
    // Authentication
    login: 'Login',
    register: 'Register',
    fullName: 'Full Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    loginWithGoogle: 'Login with Google',
    forgotPassword: 'Forgot Password?',
    termsAndConditions: 'Terms and Conditions',
    privacyPolicy: 'Privacy Policy',
    agreeToTerms: 'I agree to',
    and: 'and',
    haveAccount: 'Already have an account?',
    noAccount: "Don't have an account?",
    signInHere: 'Sign in here',
    createAccount: 'Create one here',
    welcomeBack: 'Welcome Back',
    joinQiraa: 'Join QIRAA',
    accessPlatform: 'Sign in to access QIRAA smart analytics platform',
    createNewAccount: 'Create a new account to benefit from our premium services',
    
    // Validation messages
    required: 'This field is required',
    invalidEmail: 'Invalid email address',
    passwordTooShort: 'Password must be at least 6 characters',
    passwordsDontMatch: 'Passwords do not match',
    nameRequired: 'Full name is required',
    
    // Success messages
    welcomeUser: 'Welcome to QIRAA!',
    accountCreated: 'Account created successfully',
    loginSuccess: 'Login successful',
    
    // Error messages
    loginError: 'Invalid email or password',
    emailExists: 'Email already exists',
    registrationError: 'Error creating account',
    
    // Buttons
    signIn: 'Sign In',
    signUp: 'Sign Up',
    or: 'or',

    // QIRAA Signals Page
    qiraaSignalsTitle: 'QIRAA Signals',
    qiraaSignalsSubtitle: 'Startup Sales Intelligence',
    filtersControlPanel: 'Control Panel & Filters',
    country: 'Country',
    selectCountry: 'Select Country',
    mainSector: 'Main Sector',
    selectSector: 'Select Sector',
    subSector: 'Sub-sector',
    selectSubSector: 'Select Sub-sector',
    companyName: 'Company Name',
    selectCompany: 'Select Company',
    sectorAverage: 'Sector Average',
    monthlyView: 'Monthly View',
    annualView: 'Annual View',
    selectMonthsComparison: 'Select Months for Comparison',
    selectFirstMonth: 'Select First Month:',
    selectSecondMonth: 'Select Second Month for Comparison:',
    totalRevenue: 'Total Revenue',
    totalSales: 'Total Sales',
    monthlyGrowth: 'Month-over-Month Growth',
    dailyRevenue: 'Daily Revenue (USD)',
    firstMonth: 'First Month:',
    secondMonth: 'Second Month:',
    change: 'Change:',
    selectYear: 'Select Year',
    selectYearLabel: 'Select Year',
    totalAnnualRevenue: 'Total Annual Revenue',
    totalAnnualSales: 'Total Annual Sales',
    bestQuarter: 'Best Performing Quarter',
    yearOverYearGrowth: 'Year-over-Year Growth',
    annualTrend: 'Annual Revenue Trend',
    advancedAnalysis: 'Advanced Analysis Tools',
    companyBenchmarking: 'Company Benchmarking',
    companyBenchmarkingDesc: 'Choose up to 3 companies from the same sector to compare their monthly or annual performance side by side',
    selectCompaniesCompare: 'Select Companies to Compare',
    marketShareAnalysis: 'Market Share Analysis',
    marketShareDesc: 'Discover the estimated market share of the company within its sub-sector',
    exportData: 'Export Data',
    exportDataDesc: 'Download selected data as CSV file for your own analysis',
    exportToCsv: 'Export to CSV',
    proFeature: 'Feature available in Pro plan',
    selectedCompany: 'Selected Company',
    competitors: 'Competitors',
    totalRevenueTooltip: 'Total revenue achieved during the month in local currency',
    totalSalesTooltip: 'Total number of sales achieved during the month',
    monthlyGrowthTooltip: 'Percentage change in revenue compared to previous month',
    quarterlyRevenue: 'Quarterly Revenue',
    exportDataDescription: 'Download selected data as CSV file for your own analysis',
    
    // Footer translations
    quickLinks: 'Quick Links',
    home: 'Home',
    articles: 'Articles',
    reports: 'Strategic Reports',
    qiraaSignals: 'QIRAA Signals',
    pricing: 'Pricing',
    about: 'About Us',
    supportHelp: 'Support & Help',
    helpCenter: 'Help Center',
    contactUs: 'Contact Us',
    api: 'API',
    privacyPolicyFooter: 'Privacy Policy',
    termsOfUse: 'Terms of Use',
    newsletter: 'Subscribe to Newsletter',
    newsletterDesc: 'Get the latest insights and analysis directly in your email',
    yourEmail: 'Your email',
    subscribe: 'Subscribe',
    allRightsReserved: 'All rights reserved',
    cookiePolicy: 'Cookie Policy',
    
    // Pricing page translations
    choosePlan: 'Choose the Right Plan for You',
    pricingSubtitle: 'Flexible plans that suit all your investment needs from beginners to large enterprises',
    freePlan: 'Free',
    basicPlan: 'Basic',
    proPlan: 'Pro',
    enterprisePlan: 'Enterprise',
    freePlanDesc: 'For beginners and new entrepreneurs',
    basicPlanDesc: 'For individual investors and startups',
    proPlanDesc: 'For professional investors and medium enterprises',
    enterprisePlanDesc: 'For large enterprises and investment funds',
    monthlyPricing: 'Monthly',
    annualPricing: 'Annually',
    mostPopular: 'Most Popular',
    getStarted: 'Get Started Free',
    subscribeNow: 'Subscribe Now',
    subscribeToPro: 'Subscribe to Pro',
    contactSales: 'Contact Sales',
    moneyBackGuarantee: 'All plans include 30-day money-back guarantee',
    noSetupFees: 'No setup fees',
    cancelAnytime: 'Cancel anytime',
    instantSupport: 'Instant support',
  }
};

export const useTranslation = () => {
  const { language } = useLanguage();
  return translations[language];
};