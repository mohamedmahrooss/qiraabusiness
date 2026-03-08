import { useState, useEffect } from 'react';

export type Language = 'ar' | 'en' | 'fr' | 'hi' | 'ja' | 'sg';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
}

const RTL_LANGUAGES: Language[] = ['ar'];

export const useLanguage = (): LanguageState => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('qiraa-language');
    return (saved as Language) || 'ar';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('qiraa-language', lang);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const isRTL = RTL_LANGUAGES.includes(language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language === 'sg' ? 'en-SG' : language;
  }, [language]);

  return {
    language,
    setLanguage,
    isRTL: RTL_LANGUAGES.includes(language),
  };
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  ar: 'العربية',
  en: 'English',
  fr: 'Français',
  hi: 'हिन्दी',
  ja: '日本語',
  sg: 'SG English',
};

type TranslationKeys = {
  // Auth
  login: string; register: string; fullName: string; email: string; password: string;
  confirmPassword: string; loginWithGoogle: string; forgotPassword: string;
  termsAndConditions: string; privacyPolicy: string; agreeToTerms: string; and: string;
  haveAccount: string; noAccount: string; signInHere: string; createAccount: string;
  welcomeBack: string; joinQiraa: string; accessPlatform: string; createNewAccount: string;
  // Validation
  required: string; invalidEmail: string; passwordTooShort: string; passwordsDontMatch: string; nameRequired: string;
  // Success
  welcomeUser: string; accountCreated: string; loginSuccess: string;
  // Error
  loginError: string; emailExists: string; registrationError: string;
  // Buttons
  signIn: string; signUp: string; or: string;
  // Signals
  qiraaSignalsTitle: string; qiraaSignalsSubtitle: string; filtersControlPanel: string;
  country: string; selectCountry: string; mainSector: string; selectSector: string;
  subSector: string; selectSubSector: string; companyName: string; selectCompany: string;
  sectorAverage: string; monthlyView: string; annualView: string;
  selectMonthsComparison: string; selectFirstMonth: string; selectSecondMonth: string;
  totalRevenue: string; totalSales: string; monthlyGrowth: string; dailyRevenue: string;
  firstMonth: string; secondMonth: string; change: string; selectYear: string; selectYearLabel: string;
  totalAnnualRevenue: string; totalAnnualSales: string; bestQuarter: string;
  yearOverYearGrowth: string; annualTrend: string; advancedAnalysis: string;
  companyBenchmarking: string; companyBenchmarkingDesc: string; selectCompaniesCompare: string;
  marketShareAnalysis: string; marketShareDesc: string; exportData: string; exportDataDesc: string;
  exportToCsv: string; proFeature: string; selectedCompany: string; competitors: string;
  totalRevenueTooltip: string; totalSalesTooltip: string; monthlyGrowthTooltip: string;
  quarterlyRevenue: string; exportDataDescription: string;
  // Footer
  quickLinks: string; home: string; articles: string; reports: string; qiraaSignals: string;
  pricing: string; about: string; supportHelp: string; helpCenter: string; contactUs: string;
  api: string; privacyPolicyFooter: string; termsOfUse: string; newsletter: string;
  newsletterDesc: string; yourEmail: string; subscribe: string; allRightsReserved: string; cookiePolicy: string;
  // Pricing
  choosePlan: string; pricingSubtitle: string; freePlan: string; basicPlan: string;
  proPlan: string; enterprisePlan: string; freePlanDesc: string; basicPlanDesc: string;
  proPlanDesc: string; enterprisePlanDesc: string; monthlyPricing: string; annualPricing: string;
  mostPopular: string; getStarted: string; subscribeNow: string; subscribeToPro: string;
  contactSales: string; moneyBackGuarantee: string; noSetupFees: string; cancelAnytime: string; instantSupport: string;
};

const ar: TranslationKeys = {
  login: 'تسجيل الدخول', register: 'إنشاء حساب جديد', fullName: 'الاسم الكامل', email: 'البريد الإلكتروني', password: 'كلمة المرور',
  confirmPassword: 'تأكيد كلمة المرور', loginWithGoogle: 'تسجيل الدخول بواسطة Google', forgotPassword: 'نسيت كلمة المرور؟',
  termsAndConditions: 'الشروط والأحكام', privacyPolicy: 'سياسة الخصوصية', agreeToTerms: 'أوافق على', and: 'و',
  haveAccount: 'لديك حساب بالفعل؟', noAccount: 'ليس لديك حساب؟', signInHere: 'سجل دخولك هنا', createAccount: 'أنشئ حسابك هنا',
  welcomeBack: 'مرحباً بعودتك', joinQiraa: 'انضم إلى قراءة', accessPlatform: 'قم بالدخول للوصول إلى منصة قراءة للتحليلات الذكية',
  createNewAccount: 'أنشئ حساباً جديداً للاستفادة من خدماتنا المتميزة',
  required: 'هذا الحقل مطلوب', invalidEmail: 'البريد الإلكتروني غير صحيح', passwordTooShort: 'كلمة المرور يجب أن تكون على الأقل 6 أحرف',
  passwordsDontMatch: 'كلمات المرور غير متطابقة', nameRequired: 'الاسم الكامل مطلوب',
  welcomeUser: 'مرحباً بك في قراءة!', accountCreated: 'تم إنشاء حسابك بنجاح', loginSuccess: 'تم تسجيل الدخول بنجاح',
  loginError: 'خطأ في البريد الإلكتروني أو كلمة المرور', emailExists: 'البريد الإلكتروني مستخدم بالفعل', registrationError: 'حدث خطأ أثناء إنشاء الحساب',
  signIn: 'تسجيل الدخول', signUp: 'إنشاء حساب', or: 'أو',
  qiraaSignalsTitle: 'مؤشرات قراءة (QIRAA Signals)', qiraaSignalsSubtitle: 'مؤشرات المبيعات الذكية للشركات الناشئة',
  filtersControlPanel: 'لوحة التحكم والفلاتر', country: 'الدولة', selectCountry: 'اختر الدولة',
  mainSector: 'القطاع الرئيسي', selectSector: 'اختر القطاع', subSector: 'القطاع الفرعي', selectSubSector: 'اختر القطاع الفرعي',
  companyName: 'اسم الشركة', selectCompany: 'اختر الشركة', sectorAverage: 'متوسط أداء القطاع',
  monthlyView: 'نظرة شهرية', annualView: 'نظرة سنوية', selectMonthsComparison: 'اختيار الأشهر للمقارنة',
  selectFirstMonth: 'اختر الشهر الأول:', selectSecondMonth: 'اختر الشهر الثاني للمقارنة:',
  totalRevenue: 'إجمالي الإيرادات', totalSales: 'إجمالي المبيعات', monthlyGrowth: 'معدل النمو الشهري',
  dailyRevenue: 'الإيرادات اليومية (دولار أمريكي)', firstMonth: 'الشهر الأول:', secondMonth: 'الشهر الثاني:',
  change: 'التغيير:', selectYear: 'اختيار السنة', selectYearLabel: 'اختر السنة',
  totalAnnualRevenue: 'إجمالي الإيرادات السنوية', totalAnnualSales: 'إجمالي المبيعات السنوية',
  bestQuarter: 'أفضل ربع أداءً', yearOverYearGrowth: 'معدل النمو السنوي', annualTrend: 'الاتجاه السنوي للإيرادات',
  advancedAnalysis: 'أدوات تحليل متقدمة', companyBenchmarking: 'مقارنة الشركات',
  companyBenchmarkingDesc: 'اختر ما يصل إلى 3 شركات من نفس القطاع لمقارنة أدائها الشهري أو السنوي جنباً إلى جنب',
  selectCompaniesCompare: 'اختر الشركات للمقارنة', marketShareAnalysis: 'تحليل الحصة السوقية',
  marketShareDesc: 'اكتشف الحصة السوقية المقدرة للشركة داخل قطاعها الفرعي',
  exportData: 'تصدير البيانات', exportDataDesc: 'قم بتنزيل البيانات المحددة كملف CSV لتحليلاتك الخاصة',
  exportToCsv: 'تصدير إلى CSV', proFeature: 'ميزة متاحة في الخطة الاحترافية',
  selectedCompany: 'الشركة المختارة', competitors: 'المنافسون',
  totalRevenueTooltip: 'إجمالي الإيرادات المحققة خلال الشهر بالعملة المحلية',
  totalSalesTooltip: 'عدد المبيعات الإجمالي المحقق خلال الشهر',
  monthlyGrowthTooltip: 'النسبة المئوية للتغيير في الإيرادات مقارنة بالشهر السابق',
  quarterlyRevenue: 'الإيرادات الربع سنوية', exportDataDescription: 'قم بتنزيل البيانات المحددة كملف CSV لتحليلاتك الخاصة',
  quickLinks: 'روابط سريعة', home: 'الرئيسية', articles: 'التحليلات', reports: 'التقارير الاستراتيجية',
  qiraaSignals: 'مؤشرات قراءة', pricing: 'الباقات والأسعار', about: 'من نحن',
  supportHelp: 'الدعم والمساعدة', helpCenter: 'مركز المساعدة', contactUs: 'تواصل معنا', api: 'واجهة API',
  privacyPolicyFooter: 'سياسة الخصوصية', termsOfUse: 'شروط الاستخدام',
  newsletter: 'اشترك في النشرة البريدية', newsletterDesc: 'احصل على أحدث الرؤى والتحليلات مباشرة في بريدك الإلكتروني',
  yourEmail: 'بريدك الإلكتروني', subscribe: 'اشتراك', allRightsReserved: 'جميع الحقوق محفوظة', cookiePolicy: 'سياسة الكوكيز',
  choosePlan: 'اختر الباقة المناسبة لك', pricingSubtitle: 'باقات مرنة تناسب جميع احتياجاتك الاستثمارية من البداية حتى المؤسسات الكبيرة',
  freePlan: 'المجانية', basicPlan: 'الأساسية', proPlan: 'الاحترافية', enterprisePlan: 'المؤسسية',
  freePlanDesc: 'للمبتدئين ورواد الأعمال الجدد', basicPlanDesc: 'للمستثمرين الأفراد والشركات الناشئة',
  proPlanDesc: 'للمستثمرين المحترفين والمؤسسات المتوسطة', enterprisePlanDesc: 'للمؤسسات الكبيرة وصناديق الاستثمار',
  monthlyPricing: 'شهرياً', annualPricing: 'سنوياً', mostPopular: 'الأكثر شعبية', getStarted: 'ابدأ مجاناً',
  subscribeNow: 'اشترك الآن', subscribeToPro: 'اشترك في الاحترافية', contactSales: 'تواصل معنا',
  moneyBackGuarantee: 'جميع الباقات تشمل ضمان استرداد المال خلال 30 يوماً',
  noSetupFees: 'بدون رسوم إعداد', cancelAnytime: 'إلغاء في أي وقت', instantSupport: 'دعم فني لحظي',
};

const en: TranslationKeys = {
  login: 'Login', register: 'Register', fullName: 'Full Name', email: 'Email', password: 'Password',
  confirmPassword: 'Confirm Password', loginWithGoogle: 'Login with Google', forgotPassword: 'Forgot Password?',
  termsAndConditions: 'Terms and Conditions', privacyPolicy: 'Privacy Policy', agreeToTerms: 'I agree to', and: 'and',
  haveAccount: 'Already have an account?', noAccount: "Don't have an account?", signInHere: 'Sign in here', createAccount: 'Create one here',
  welcomeBack: 'Welcome Back', joinQiraa: 'Join QIRAA', accessPlatform: 'Sign in to access QIRAA smart analytics platform',
  createNewAccount: 'Create a new account to benefit from our premium services',
  required: 'This field is required', invalidEmail: 'Invalid email address', passwordTooShort: 'Password must be at least 6 characters',
  passwordsDontMatch: 'Passwords do not match', nameRequired: 'Full name is required',
  welcomeUser: 'Welcome to QIRAA!', accountCreated: 'Account created successfully', loginSuccess: 'Login successful',
  loginError: 'Invalid email or password', emailExists: 'Email already exists', registrationError: 'Error creating account',
  signIn: 'Sign In', signUp: 'Sign Up', or: 'or',
  qiraaSignalsTitle: 'QIRAA Signals', qiraaSignalsSubtitle: 'Startup Sales Intelligence',
  filtersControlPanel: 'Control Panel & Filters', country: 'Country', selectCountry: 'Select Country',
  mainSector: 'Main Sector', selectSector: 'Select Sector', subSector: 'Sub-sector', selectSubSector: 'Select Sub-sector',
  companyName: 'Company Name', selectCompany: 'Select Company', sectorAverage: 'Sector Average',
  monthlyView: 'Monthly View', annualView: 'Annual View', selectMonthsComparison: 'Select Months for Comparison',
  selectFirstMonth: 'Select First Month:', selectSecondMonth: 'Select Second Month for Comparison:',
  totalRevenue: 'Total Revenue', totalSales: 'Total Sales', monthlyGrowth: 'Month-over-Month Growth',
  dailyRevenue: 'Daily Revenue (USD)', firstMonth: 'First Month:', secondMonth: 'Second Month:',
  change: 'Change:', selectYear: 'Select Year', selectYearLabel: 'Select Year',
  totalAnnualRevenue: 'Total Annual Revenue', totalAnnualSales: 'Total Annual Sales',
  bestQuarter: 'Best Performing Quarter', yearOverYearGrowth: 'Year-over-Year Growth', annualTrend: 'Annual Revenue Trend',
  advancedAnalysis: 'Advanced Analysis Tools', companyBenchmarking: 'Company Benchmarking',
  companyBenchmarkingDesc: 'Choose up to 3 companies from the same sector to compare their monthly or annual performance side by side',
  selectCompaniesCompare: 'Select Companies to Compare', marketShareAnalysis: 'Market Share Analysis',
  marketShareDesc: 'Discover the estimated market share of the company within its sub-sector',
  exportData: 'Export Data', exportDataDesc: 'Download selected data as CSV file for your own analysis',
  exportToCsv: 'Export to CSV', proFeature: 'Feature available in Pro plan',
  selectedCompany: 'Selected Company', competitors: 'Competitors',
  totalRevenueTooltip: 'Total revenue achieved during the month in local currency',
  totalSalesTooltip: 'Total number of sales achieved during the month',
  monthlyGrowthTooltip: 'Percentage change in revenue compared to previous month',
  quarterlyRevenue: 'Quarterly Revenue', exportDataDescription: 'Download selected data as CSV file for your own analysis',
  quickLinks: 'Quick Links', home: 'Home', articles: 'Analyses', reports: 'Strategic Reports',
  qiraaSignals: 'QIRAA Signals', pricing: 'Pricing', about: 'About Us',
  supportHelp: 'Support & Help', helpCenter: 'Help Center', contactUs: 'Contact Us', api: 'API',
  privacyPolicyFooter: 'Privacy Policy', termsOfUse: 'Terms of Use',
  newsletter: 'Subscribe to Newsletter', newsletterDesc: 'Get the latest insights and analysis directly in your email',
  yourEmail: 'Your email', subscribe: 'Subscribe', allRightsReserved: 'All rights reserved', cookiePolicy: 'Cookie Policy',
  choosePlan: 'Choose the Right Plan for You', pricingSubtitle: 'Flexible plans that suit all your investment needs from beginners to large enterprises',
  freePlan: 'Free', basicPlan: 'Basic', proPlan: 'Pro', enterprisePlan: 'Enterprise',
  freePlanDesc: 'For beginners and new entrepreneurs', basicPlanDesc: 'For individual investors and startups',
  proPlanDesc: 'For professional investors and medium enterprises', enterprisePlanDesc: 'For large enterprises and investment funds',
  monthlyPricing: 'Monthly', annualPricing: 'Annually', mostPopular: 'Most Popular', getStarted: 'Get Started Free',
  subscribeNow: 'Subscribe Now', subscribeToPro: 'Subscribe to Pro', contactSales: 'Contact Sales',
  moneyBackGuarantee: 'All plans include 30-day money-back guarantee',
  noSetupFees: 'No setup fees', cancelAnytime: 'Cancel anytime', instantSupport: 'Instant support',
};

const fr: TranslationKeys = {
  login: 'Connexion', register: 'Créer un compte', fullName: 'Nom complet', email: 'E-mail', password: 'Mot de passe',
  confirmPassword: 'Confirmer le mot de passe', loginWithGoogle: 'Se connecter avec Google', forgotPassword: 'Mot de passe oublié ?',
  termsAndConditions: 'Conditions générales', privacyPolicy: 'Politique de confidentialité', agreeToTerms: "J'accepte les", and: 'et',
  haveAccount: 'Vous avez déjà un compte ?', noAccount: "Vous n'avez pas de compte ?", signInHere: 'Connectez-vous ici', createAccount: 'Créez-en un ici',
  welcomeBack: 'Bon retour', joinQiraa: 'Rejoignez QIRAA', accessPlatform: "Connectez-vous pour accéder à la plateforme d'intelligence de marché QIRAA",
  createNewAccount: 'Créez un nouveau compte pour bénéficier de nos services premium',
  required: 'Ce champ est requis', invalidEmail: 'Adresse e-mail invalide', passwordTooShort: 'Le mot de passe doit comporter au moins 6 caractères',
  passwordsDontMatch: 'Les mots de passe ne correspondent pas', nameRequired: 'Le nom complet est requis',
  welcomeUser: 'Bienvenue sur QIRAA !', accountCreated: 'Compte créé avec succès', loginSuccess: 'Connexion réussie',
  loginError: 'E-mail ou mot de passe invalide', emailExists: "L'e-mail existe déjà", registrationError: 'Erreur lors de la création du compte',
  signIn: 'Se connecter', signUp: "S'inscrire", or: 'ou',
  qiraaSignalsTitle: 'QIRAA Signals', qiraaSignalsSubtitle: "Intelligence commerciale des startups",
  filtersControlPanel: 'Panneau de contrôle et filtres', country: 'Pays', selectCountry: 'Sélectionner le pays',
  mainSector: 'Secteur principal', selectSector: 'Sélectionner le secteur', subSector: 'Sous-secteur', selectSubSector: 'Sélectionner le sous-secteur',
  companyName: "Nom de l'entreprise", selectCompany: "Sélectionner l'entreprise", sectorAverage: 'Moyenne du secteur',
  monthlyView: 'Vue mensuelle', annualView: 'Vue annuelle', selectMonthsComparison: 'Sélectionner les mois à comparer',
  selectFirstMonth: 'Sélectionner le premier mois :', selectSecondMonth: 'Sélectionner le deuxième mois :',
  totalRevenue: 'Revenu total', totalSales: 'Ventes totales', monthlyGrowth: 'Croissance mensuelle',
  dailyRevenue: 'Revenu quotidien (USD)', firstMonth: 'Premier mois :', secondMonth: 'Deuxième mois :',
  change: 'Variation :', selectYear: "Sélectionner l'année", selectYearLabel: "Sélectionner l'année",
  totalAnnualRevenue: 'Revenu annuel total', totalAnnualSales: 'Ventes annuelles totales',
  bestQuarter: 'Meilleur trimestre', yearOverYearGrowth: 'Croissance annuelle', annualTrend: 'Tendance annuelle des revenus',
  advancedAnalysis: "Outils d'analyse avancés", companyBenchmarking: 'Benchmarking entreprises',
  companyBenchmarkingDesc: "Comparez jusqu'à 3 entreprises du même secteur",
  selectCompaniesCompare: 'Sélectionner les entreprises', marketShareAnalysis: 'Analyse des parts de marché',
  marketShareDesc: "Découvrez la part de marché estimée de l'entreprise dans son sous-secteur",
  exportData: 'Exporter les données', exportDataDesc: 'Téléchargez les données sélectionnées en CSV',
  exportToCsv: 'Exporter en CSV', proFeature: 'Disponible dans le plan Pro',
  selectedCompany: 'Entreprise sélectionnée', competitors: 'Concurrents',
  totalRevenueTooltip: 'Revenu total du mois en devise locale', totalSalesTooltip: 'Nombre total de ventes du mois',
  monthlyGrowthTooltip: 'Variation en pourcentage par rapport au mois précédent',
  quarterlyRevenue: 'Revenu trimestriel', exportDataDescription: 'Téléchargez les données sélectionnées en CSV',
  quickLinks: 'Liens rapides', home: 'Accueil', articles: 'Analyses', reports: 'Rapports stratégiques',
  qiraaSignals: 'QIRAA Signals', pricing: 'Tarifs', about: 'À propos',
  supportHelp: 'Support & Aide', helpCenter: "Centre d'aide", contactUs: 'Nous contacter', api: 'API',
  privacyPolicyFooter: 'Politique de confidentialité', termsOfUse: "Conditions d'utilisation",
  newsletter: 'Newsletter', newsletterDesc: 'Recevez les dernières analyses directement dans votre boîte e-mail',
  yourEmail: 'Votre e-mail', subscribe: "S'abonner", allRightsReserved: 'Tous droits réservés', cookiePolicy: 'Politique de cookies',
  choosePlan: 'Choisissez le plan adapté', pricingSubtitle: 'Des plans flexibles pour tous vos besoins d\'investissement',
  freePlan: 'Gratuit', basicPlan: 'Basique', proPlan: 'Pro', enterprisePlan: 'Entreprise',
  freePlanDesc: 'Pour les débutants et nouveaux entrepreneurs', basicPlanDesc: 'Pour les investisseurs individuels et startups',
  proPlanDesc: 'Pour les investisseurs professionnels', enterprisePlanDesc: "Pour les grandes entreprises et fonds d'investissement",
  monthlyPricing: 'Mensuel', annualPricing: 'Annuel', mostPopular: 'Le plus populaire', getStarted: 'Commencer gratuitement',
  subscribeNow: "S'abonner", subscribeToPro: "S'abonner au Pro", contactSales: 'Contacter les ventes',
  moneyBackGuarantee: 'Garantie de remboursement de 30 jours', noSetupFees: 'Sans frais de mise en place',
  cancelAnytime: 'Annulez à tout moment', instantSupport: 'Support instantané',
};

const hi: TranslationKeys = {
  login: 'लॉग इन', register: 'खाता बनाएं', fullName: 'पूरा नाम', email: 'ईमेल', password: 'पासवर्ड',
  confirmPassword: 'पासवर्ड की पुष्टि करें', loginWithGoogle: 'Google से लॉग इन', forgotPassword: 'पासवर्ड भूल गए?',
  termsAndConditions: 'नियम और शर्तें', privacyPolicy: 'गोपनीयता नीति', agreeToTerms: 'मैं सहमत हूं', and: 'और',
  haveAccount: 'पहले से खाता है?', noAccount: 'खाता नहीं है?', signInHere: 'यहां लॉग इन करें', createAccount: 'यहां बनाएं',
  welcomeBack: 'वापसी पर स्वागत है', joinQiraa: 'QIRAA से जुड़ें', accessPlatform: 'QIRAA स्मार्ट एनालिटिक्स प्लेटफ़ॉर्म तक पहुँचें',
  createNewAccount: 'हमारी प्रीमियम सेवाओं का लाभ उठाने के लिए खाता बनाएं',
  required: 'यह फ़ील्ड आवश्यक है', invalidEmail: 'अमान्य ईमेल पता', passwordTooShort: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए',
  passwordsDontMatch: 'पासवर्ड मेल नहीं खाते', nameRequired: 'पूरा नाम आवश्यक है',
  welcomeUser: 'QIRAA में आपका स्वागत है!', accountCreated: 'खाता सफलतापूर्वक बनाया गया', loginSuccess: 'लॉगिन सफल',
  loginError: 'अमान्य ईमेल या पासवर्ड', emailExists: 'ईमेल पहले से मौजूद है', registrationError: 'खाता बनाने में त्रुटि',
  signIn: 'लॉग इन', signUp: 'साइन अप', or: 'या',
  qiraaSignalsTitle: 'QIRAA सिग्नल्स', qiraaSignalsSubtitle: 'स्टार्टअप सेल्स इंटेलिजेंस',
  filtersControlPanel: 'कंट्रोल पैनल और फ़िल्टर', country: 'देश', selectCountry: 'देश चुनें',
  mainSector: 'मुख्य क्षेत्र', selectSector: 'क्षेत्र चुनें', subSector: 'उप-क्षेत्र', selectSubSector: 'उप-क्षेत्र चुनें',
  companyName: 'कंपनी का नाम', selectCompany: 'कंपनी चुनें', sectorAverage: 'क्षेत्र औसत',
  monthlyView: 'मासिक दृश्य', annualView: 'वार्षिक दृश्य', selectMonthsComparison: 'तुलना के लिए महीने चुनें',
  selectFirstMonth: 'पहला महीना:', selectSecondMonth: 'दूसरा महीना:',
  totalRevenue: 'कुल राजस्व', totalSales: 'कुल बिक्री', monthlyGrowth: 'मासिक वृद्धि',
  dailyRevenue: 'दैनिक राजस्व (USD)', firstMonth: 'पहला महीना:', secondMonth: 'दूसरा महीना:',
  change: 'बदलाव:', selectYear: 'वर्ष चुनें', selectYearLabel: 'वर्ष चुनें',
  totalAnnualRevenue: 'कुल वार्षिक राजस्व', totalAnnualSales: 'कुल वार्षिक बिक्री',
  bestQuarter: 'सर्वश्रेष्ठ तिमाही', yearOverYearGrowth: 'वार्षिक वृद्धि', annualTrend: 'वार्षिक राजस्व रुझान',
  advancedAnalysis: 'उन्नत विश्लेषण उपकरण', companyBenchmarking: 'कंपनी बेंचमार्किंग',
  companyBenchmarkingDesc: 'एक ही क्षेत्र की 3 कंपनियों की तुलना करें',
  selectCompaniesCompare: 'तुलना के लिए कंपनियां चुनें', marketShareAnalysis: 'बाज़ार हिस्सेदारी विश्लेषण',
  marketShareDesc: 'उप-क्षेत्र में कंपनी की अनुमानित बाज़ार हिस्सेदारी जानें',
  exportData: 'डेटा निर्यात करें', exportDataDesc: 'CSV के रूप में डेटा डाउनलोड करें',
  exportToCsv: 'CSV में निर्यात', proFeature: 'Pro योजना में उपलब्ध',
  selectedCompany: 'चयनित कंपनी', competitors: 'प्रतिस्पर्धी',
  totalRevenueTooltip: 'महीने का कुल राजस्व', totalSalesTooltip: 'महीने की कुल बिक्री',
  monthlyGrowthTooltip: 'पिछले महीने की तुलना में राजस्व में प्रतिशत बदलाव',
  quarterlyRevenue: 'तिमाही राजस्व', exportDataDescription: 'CSV के रूप में डेटा डाउनलोड करें',
  quickLinks: 'त्वरित लिंक', home: 'होम', articles: 'विश्लेषण', reports: 'रणनीतिक रिपोर्ट',
  qiraaSignals: 'QIRAA सिग्नल्स', pricing: 'मूल्य निर्धारण', about: 'हमारे बारे में',
  supportHelp: 'सहायता', helpCenter: 'सहायता केंद्र', contactUs: 'संपर्क करें', api: 'API',
  privacyPolicyFooter: 'गोपनीयता नीति', termsOfUse: 'उपयोग की शर्तें',
  newsletter: 'न्यूज़लेटर', newsletterDesc: 'नवीनतम विश्लेषण सीधे अपने ईमेल में प्राप्त करें',
  yourEmail: 'आपका ईमेल', subscribe: 'सदस्यता लें', allRightsReserved: 'सर्वाधिकार सुरक्षित', cookiePolicy: 'कुकी नीति',
  choosePlan: 'अपने लिए सही योजना चुनें', pricingSubtitle: 'शुरुआती से लेकर बड़े उद्यमों तक सभी के लिए लचीली योजनाएं',
  freePlan: 'मुफ़्त', basicPlan: 'बेसिक', proPlan: 'प्रो', enterprisePlan: 'एंटरप्राइज़',
  freePlanDesc: 'शुरुआती उद्यमियों के लिए', basicPlanDesc: 'व्यक्तिगत निवेशकों और स्टार्टअप के लिए',
  proPlanDesc: 'पेशेवर निवेशकों के लिए', enterprisePlanDesc: 'बड़े उद्यमों और निवेश कोषों के लिए',
  monthlyPricing: 'मासिक', annualPricing: 'वार्षिक', mostPopular: 'सबसे लोकप्रिय', getStarted: 'मुफ़्त शुरू करें',
  subscribeNow: 'अभी सदस्यता लें', subscribeToPro: 'Pro सदस्यता लें', contactSales: 'बिक्री से संपर्क करें',
  moneyBackGuarantee: 'सभी योजनाओं में 30 दिन की मनी-बैक गारंटी', noSetupFees: 'कोई सेटअप शुल्क नहीं',
  cancelAnytime: 'कभी भी रद्द करें', instantSupport: 'तत्काल सहायता',
};

const ja: TranslationKeys = {
  login: 'ログイン', register: 'アカウント作成', fullName: '氏名', email: 'メールアドレス', password: 'パスワード',
  confirmPassword: 'パスワード確認', loginWithGoogle: 'Googleでログイン', forgotPassword: 'パスワードをお忘れですか？',
  termsAndConditions: '利用規約', privacyPolicy: 'プライバシーポリシー', agreeToTerms: '同意します', and: 'と',
  haveAccount: 'アカウントをお持ちですか？', noAccount: 'アカウントをお持ちでないですか？', signInHere: 'こちらからログイン', createAccount: 'こちらから作成',
  welcomeBack: 'おかえりなさい', joinQiraa: 'QIRAAに参加', accessPlatform: 'QIRAAスマート分析プラットフォームにアクセス',
  createNewAccount: 'プレミアムサービスをご利用いただくために新しいアカウントを作成',
  required: 'この項目は必須です', invalidEmail: '無効なメールアドレス', passwordTooShort: 'パスワードは6文字以上である必要があります',
  passwordsDontMatch: 'パスワードが一致しません', nameRequired: '氏名は必須です',
  welcomeUser: 'QIRAAへようこそ！', accountCreated: 'アカウントが作成されました', loginSuccess: 'ログイン成功',
  loginError: 'メールまたはパスワードが無効です', emailExists: 'メールアドレスは既に使用されています', registrationError: 'アカウント作成エラー',
  signIn: 'ログイン', signUp: '登録', or: 'または',
  qiraaSignalsTitle: 'QIRAAシグナル', qiraaSignalsSubtitle: 'スタートアップセールスインテリジェンス',
  filtersControlPanel: 'コントロールパネルとフィルター', country: '国', selectCountry: '国を選択',
  mainSector: '主要セクター', selectSector: 'セクターを選択', subSector: 'サブセクター', selectSubSector: 'サブセクターを選択',
  companyName: '企業名', selectCompany: '企業を選択', sectorAverage: 'セクター平均',
  monthlyView: '月次ビュー', annualView: '年次ビュー', selectMonthsComparison: '比較する月を選択',
  selectFirstMonth: '最初の月：', selectSecondMonth: '2番目の月：',
  totalRevenue: '総収益', totalSales: '総売上', monthlyGrowth: '月次成長率',
  dailyRevenue: '日次収益（USD）', firstMonth: '最初の月：', secondMonth: '2番目の月：',
  change: '変動：', selectYear: '年を選択', selectYearLabel: '年を選択',
  totalAnnualRevenue: '年間総収益', totalAnnualSales: '年間総売上',
  bestQuarter: '最優秀四半期', yearOverYearGrowth: '前年比成長率', annualTrend: '年間収益トレンド',
  advancedAnalysis: '高度な分析ツール', companyBenchmarking: '企業ベンチマーキング',
  companyBenchmarkingDesc: '同セクターの最大3社を比較',
  selectCompaniesCompare: '比較する企業を選択', marketShareAnalysis: '市場シェア分析',
  marketShareDesc: 'サブセクター内の推定市場シェアを確認',
  exportData: 'データエクスポート', exportDataDesc: 'CSV形式でデータをダウンロード',
  exportToCsv: 'CSVにエクスポート', proFeature: 'Proプランで利用可能',
  selectedCompany: '選択企業', competitors: '競合他社',
  totalRevenueTooltip: '月間総収益', totalSalesTooltip: '月間総売上数',
  monthlyGrowthTooltip: '前月比の収益変動率',
  quarterlyRevenue: '四半期収益', exportDataDescription: 'CSV形式でデータをダウンロード',
  quickLinks: 'クイックリンク', home: 'ホーム', articles: '分析', reports: '戦略レポート',
  qiraaSignals: 'QIRAAシグナル', pricing: '料金', about: '会社概要',
  supportHelp: 'サポート', helpCenter: 'ヘルプセンター', contactUs: 'お問い合わせ', api: 'API',
  privacyPolicyFooter: 'プライバシーポリシー', termsOfUse: '利用規約',
  newsletter: 'ニュースレター', newsletterDesc: '最新の分析を直接メールでお届けします',
  yourEmail: 'メールアドレス', subscribe: '購読する', allRightsReserved: 'All rights reserved', cookiePolicy: 'Cookieポリシー',
  choosePlan: '最適なプランを選択', pricingSubtitle: '初心者から大企業まで、すべてのニーズに対応する柔軟なプラン',
  freePlan: '無料', basicPlan: 'ベーシック', proPlan: 'プロ', enterprisePlan: 'エンタープライズ',
  freePlanDesc: '初心者と新しい起業家向け', basicPlanDesc: '個人投資家とスタートアップ向け',
  proPlanDesc: 'プロの投資家向け', enterprisePlanDesc: '大企業と投資ファンド向け',
  monthlyPricing: '月額', annualPricing: '年額', mostPopular: '最も人気', getStarted: '無料で始める',
  subscribeNow: '今すぐ購読', subscribeToPro: 'Proに購読', contactSales: '営業に連絡',
  moneyBackGuarantee: '全プラン30日間返金保証', noSetupFees: 'セットアップ料金なし',
  cancelAnytime: 'いつでもキャンセル可能', instantSupport: '即時サポート',
};

// Singapore English - localized with ASEAN/SEA business context
const sg: TranslationKeys = {
  ...en,
  qiraaSignalsSubtitle: 'Startup Sales Intelligence — MENA & Beyond',
  accessPlatform: 'Sign in to access QIRAA market intelligence for MENA and emerging markets',
  createNewAccount: 'Create an account to access premium market intelligence services',
  newsletterDesc: 'Get the latest MENA market insights and analysis delivered to your inbox',
  pricingSubtitle: 'Flexible plans for investors, venture capital firms, and enterprises across Asia-Pacific and MENA',
  basicPlanDesc: 'For individual investors and cross-border startups',
  proPlanDesc: 'For professional investors and regional enterprises',
  enterprisePlanDesc: 'For sovereign wealth funds, VCs, and multinational corporations',
};

export const translations: Record<Language, TranslationKeys> = { ar, en, fr, hi, ja, sg };

export const useTranslation = () => {
  const { language } = useLanguage();
  return translations[language];
};
