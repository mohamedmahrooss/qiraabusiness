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
  }
};

export const useTranslation = () => {
  const { language } = useLanguage();
  return translations[language];
};