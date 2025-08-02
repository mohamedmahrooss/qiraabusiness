import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <main>
        <HeroSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
