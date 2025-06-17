import { HeroSection } from "@/components/blocks/hero";
import { FeaturesSection } from "@/components/blocks/features";
import { CTASection } from "@/components/blocks/cta";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Call to Action */}
      <CTASection />
    </div>
  );
};

export default Index;
