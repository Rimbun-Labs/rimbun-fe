import { LandingHeader } from "@/components/blocks/header/LandingHeader";
import { HeroSection } from "@/components/blocks/hero";
import { FeaturesSection } from "@/components/blocks/features";
import { DashboardPreview } from "@/components/blocks/dashboard-preview";
import { CTASection } from "@/components/blocks/cta";
import { Footer } from "@/components/blocks/footer";
import { FloatingShapes } from "@/components/blocks/ui";
import { SamplePlansSection } from "@/components/blocks/sample-plans/SamplePlansSection";

export default function ForIndividuals() {
  return (
    <div className="min-h-screen relative">
      <LandingHeader />
      <FloatingShapes />

      <HeroSection />
      <SamplePlansSection />
      <FeaturesSection />
      <DashboardPreview />
      <CTASection />
      <Footer />
    </div>
  );
}
