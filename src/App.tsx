import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";
import ScrollToTop from "./components/ScrollToTop";
import MainLayout from "./components/layout/MainLayout";
import CookieConsent from "./components/CookieConsent";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Analytics from "./pages/Analytics";
import AnalyticsDetails from "./pages/AnalyticsDetails";
import Reports from "./pages/Reports";
import ReportDetails from "./pages/ReportDetails";
import About from "./pages/About";
import QiraaSignals from "./pages/QiraaSignals";
import QiraaMindPage from "./pages/QiraaMindPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import CookiePolicy from "./pages/CookiePolicy";
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFail from "./pages/PaymentFail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RouteHandler = () => {
  const location = useLocation();
  const previousLocation = useRef(location);
  
  const isAuthRoute = ['/auth', '/login', '/register'].includes(location.pathname);

  useEffect(() => {
    if (!isAuthRoute) {
      previousLocation.current = location;
    }
  }, [location, isAuthRoute]);

  const backgroundLocation = isAuthRoute && previousLocation.current.pathname !== location.pathname
    ? previousLocation.current 
    : { ...location, pathname: '/' };

  return (
    <>
      <Routes location={isAuthRoute ? backgroundLocation : location}>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/admin" element={<MainLayout><AdminDashboard /></MainLayout>} />
        <Route path="/analytics" element={<MainLayout><Analytics /></MainLayout>} />
        <Route path="/analytics/:id" element={<MainLayout><AnalyticsDetails /></MainLayout>} />
        {/* Redirect old /articles paths */}
        <Route path="/articles" element={<MainLayout><Analytics /></MainLayout>} />
        <Route path="/articles/:id" element={<MainLayout><AnalyticsDetails /></MainLayout>} />
        <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
        <Route path="/reports/:id" element={<MainLayout><ReportDetails /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/qiraa-signals" element={<MainLayout><QiraaSignals /></MainLayout>} />
        <Route path="/qiraa-mind" element={<MainLayout><QiraaMindPage /></MainLayout>} />
        <Route path="/billing" element={<MainLayout><Pricing /></MainLayout>} />
        <Route path="/pricing" element={<MainLayout><Pricing /></MainLayout>} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/fail" element={<PaymentFail />} />
        <Route path="/privacy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
        <Route path="/terms" element={<MainLayout><TermsOfUse /></MainLayout>} />
        <Route path="/cookies" element={<MainLayout><CookiePolicy /></MainLayout>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {isAuthRoute && <Auth />}
    </>
  );
};

const App = () => {
  console.log('App component rendering...');
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <RouteHandler />
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
