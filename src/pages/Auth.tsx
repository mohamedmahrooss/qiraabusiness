import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Chrome } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage, useTranslation } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email('invalidEmail'),
  password: z.string().min(6, 'passwordTooShort'),
});

const registerSchema = z.object({
  fullName: z.string().min(1, 'nameRequired'),
  email: z.string().email('invalidEmail'),
  password: z.string().min(6, 'passwordTooShort'),
  confirmPassword: z.string().min(6, 'passwordTooShort'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'required'
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'passwordsDontMatch',
  path: ['confirmPassword'],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { isRTL } = useLanguage();
  const t = useTranslation();
  const navigate = useNavigate();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '', acceptTerms: false }
  });

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = isRTL ? 'ar' : 'en';
  }, [isRTL]);

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
      if (error) throw error;
      toast({ title: t.loginSuccess, description: t.welcomeUser });
      navigate('/dashboard');
    } catch (error: any) {
      toast({ title: t.loginError, description: error.message, variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  const handleRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email, password: data.password,
        options: { data: { full_name: data.fullName, subscription_plan: 'free' } }
      });
      if (error) throw error;
      toast({ title: t.accountCreated, description: t.welcomeUser });
      navigate('/dashboard');
    } catch (error: any) {
      toast({ title: t.registrationError, description: error.message, variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      });
      if (error) throw error;
    } catch (error: any) {
      toast({ title: t.loginError, description: error.message, variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      navigate(-1);
    }
  };

  const getFieldError = (fieldName: string, form: any) => {
    const error = form.formState.errors[fieldName];
    return error ? t[error.message as keyof typeof t] || error.message : '';
  };

  return (
    <div
      className="min-h-screen bg-background/40 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
      onClick={handleBackdropClick}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm cursor-default" onClick={(e) => e.stopPropagation()}>
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <LanguageToggle />
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl border border-border bg-card/95 backdrop-blur-xl">
          <CardHeader className="space-y-3 text-center pb-4">
            {/* Logo instead of Q */}
            <div className="mx-auto">
              <img src="/images/qiraa-logo.png" alt="QIRAA" className="h-16 mx-auto" />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-foreground">
                {isLogin ? t.welcomeBack : t.joinQiraa}
              </h1>
              <p className="text-xs text-muted-foreground">
                {isLogin ? t.accessPlatform : t.createNewAccount}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            {/* Google Login Button */}
            <Button type="button" variant="outline" size="sm" className="w-full gap-2" onClick={handleGoogleLogin} disabled={isLoading}>
              <Chrome className="h-4 w-4" />
              {t.loginWithGoogle}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground">{t.or}</span>
              </div>
            </div>

            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs">{t.email}</Label>
                  <Input id="email" type="email" dir={isRTL ? 'rtl' : 'ltr'} {...loginForm.register('email')} className={`h-9 text-sm ${loginForm.formState.errors.email ? 'border-destructive' : ''}`} />
                  {loginForm.formState.errors.email && <p className="text-xs text-destructive">{getFieldError('email', loginForm)}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password" className="text-xs">{t.password}</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? 'text' : 'password'} dir={isRTL ? 'rtl' : 'ltr'} {...loginForm.register('password')} className={`h-9 text-sm ${loginForm.formState.errors.password ? 'border-destructive' : ''}`} />
                    <Button type="button" variant="ghost" size="sm" className={`absolute top-0 h-9 px-2 ${isRTL ? 'left-0' : 'right-0'}`} onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                  {loginForm.formState.errors.password && <p className="text-xs text-destructive">{getFieldError('password', loginForm)}</p>}
                </div>

                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80 transition-colors">{t.forgotPassword}</Link>
                </div>

                <Button type="submit" size="sm" className="w-full" disabled={isLoading}>
                  {isLoading ? '...' : t.signIn}
                </Button>
              </form>
            ) : (
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="fullName" className="text-xs">{t.fullName}</Label>
                  <Input id="fullName" type="text" dir={isRTL ? 'rtl' : 'ltr'} {...registerForm.register('fullName')} className={`h-9 text-sm ${registerForm.formState.errors.fullName ? 'border-destructive' : ''}`} />
                  {registerForm.formState.errors.fullName && <p className="text-xs text-destructive">{getFieldError('fullName', registerForm)}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs">{t.email}</Label>
                  <Input id="email" type="email" dir={isRTL ? 'rtl' : 'ltr'} {...registerForm.register('email')} className={`h-9 text-sm ${registerForm.formState.errors.email ? 'border-destructive' : ''}`} />
                  {registerForm.formState.errors.email && <p className="text-xs text-destructive">{getFieldError('email', registerForm)}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password" className="text-xs">{t.password}</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? 'text' : 'password'} dir={isRTL ? 'rtl' : 'ltr'} {...registerForm.register('password')} className={`h-9 text-sm ${registerForm.formState.errors.password ? 'border-destructive' : ''}`} />
                    <Button type="button" variant="ghost" size="sm" className={`absolute top-0 h-9 px-2 ${isRTL ? 'left-0' : 'right-0'}`} onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                  {registerForm.formState.errors.password && <p className="text-xs text-destructive">{getFieldError('password', registerForm)}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confirmPassword" className="text-xs">{t.confirmPassword}</Label>
                  <div className="relative">
                    <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} dir={isRTL ? 'rtl' : 'ltr'} {...registerForm.register('confirmPassword')} className={`h-9 text-sm ${registerForm.formState.errors.confirmPassword ? 'border-destructive' : ''}`} />
                    <Button type="button" variant="ghost" size="sm" className={`absolute top-0 h-9 px-2 ${isRTL ? 'left-0' : 'right-0'}`} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                  {registerForm.formState.errors.confirmPassword && <p className="text-xs text-destructive">{getFieldError('confirmPassword', registerForm)}</p>}
                </div>

                <div className="flex items-start space-x-2">
                  <Controller name="acceptTerms" control={registerForm.control} render={({ field }) => (
                    <Checkbox id="acceptTerms" checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                  )} />
                  <Label htmlFor="acceptTerms" className="text-xs leading-4">
                    {t.agreeToTerms}{' '}
                    <Link to="/terms" className="text-primary hover:text-primary/80">{t.termsAndConditions}</Link>{' '}
                    {t.and}{' '}
                    <Link to="/privacy" className="text-primary hover:text-primary/80">{t.privacyPolicy}</Link>
                  </Label>
                </div>
                {registerForm.formState.errors.acceptTerms && <p className="text-xs text-destructive">{getFieldError('acceptTerms', registerForm)}</p>}

                <Button type="submit" size="sm" className="w-full" disabled={isLoading}>
                  {isLoading ? '...' : t.signUp}
                </Button>
              </form>
            )}

            {/* Toggle Form */}
            <div className="text-center text-xs">
              <span className="text-muted-foreground">{isLogin ? t.noAccount : t.haveAccount}</span>{' '}
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary hover:text-primary/80 font-medium transition-colors">
                {isLogin ? t.createAccount : t.signInHere}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
