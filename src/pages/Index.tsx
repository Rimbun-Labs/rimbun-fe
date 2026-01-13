import { LandingHeader } from "@/components/blocks/header/LandingHeader";
import { HeroSection } from "@/components/blocks/hero";
import { FeaturesSection } from "@/components/blocks/features";
import { DashboardPreview } from "@/components/blocks/dashboard-preview";
import { CTASection } from "@/components/blocks/cta";
import { Footer } from "@/components/blocks/footer";
import { FloatingShapes } from "@/components/blocks/ui";
import { SamplePlansSection } from "@/components/blocks/sample-plans/SamplePlansSection";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <LandingHeader />
      
      {/* Floating Background Shapes */}
      <FloatingShapes />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Sample Plans Section - Prominent placement right after Hero */}
      <SamplePlansSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Dashboard Preview */}
      <DashboardPreview />

      {/* Call to Action */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
