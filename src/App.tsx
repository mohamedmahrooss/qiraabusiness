import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Articles from "./pages/Articles";
import ArticleDetails from "./pages/ArticleDetails";
import Reports from "./pages/Reports";
import ReportDetails from "./pages/ReportDetails";
import About from "./pages/About";
import QiraaSignals from "./pages/QiraaSignals";
import QiraaMindPage from "./pages/QiraaMindPage";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  console.log('App component rendering...');
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/admin" element={<MainLayout><AdminDashboard /></MainLayout>} />
          <Route path="/articles" element={<MainLayout><Articles /></MainLayout>} />
          <Route path="/articles/:id" element={<MainLayout><ArticleDetails /></MainLayout>} />
          <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
          <Route path="/reports/:id" element={<MainLayout><ReportDetails /></MainLayout>} />
          <Route path="/about" element={<MainLayout><About /></MainLayout>} />
          <Route path="/qiraa-signals" element={<MainLayout><QiraaSignals /></MainLayout>} />
          <Route path="/qiraa-mind" element={<MainLayout><QiraaMindPage /></MainLayout>} />
          <Route path="/pricing" element={<MainLayout><Pricing /></MainLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
