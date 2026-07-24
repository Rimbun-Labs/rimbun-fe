import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/blocks/header/LandingHeader";
import { Footer } from "@/components/blocks/footer";
import { FloatingShapes } from "@/components/blocks/ui";
import { FiDemoConsole, FiDemoDisclaimerBanner } from "@/components/blocks/fi-demo";
import { fiDemoFixture } from "@/fixtures/fi-demo/data";

/**
 * Public client workspace preview — sample data only, no API calls.
 */
export default function ForBanksDemo() {
  return (
    <div className="min-h-screen relative">
      <LandingHeader />
      <FloatingShapes />

      <section className="pt-28 pb-10 md:pt-32 md:pb-14 relative">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 text-muted-foreground">
              <Link to="/clients">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Clients
              </Link>
            </Button>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Client workspace preview
            </h1>
            <p className="text-muted-foreground text-lg">
              Start with a portfolio overview, then open sample customer leads to explore
              recommended actions and supporting context.
            </p>
          </div>

          <FiDemoDisclaimerBanner />

          <FiDemoConsole data={fiDemoFixture} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
