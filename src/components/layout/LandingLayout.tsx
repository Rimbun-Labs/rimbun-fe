import React from "react";
import { Outlet } from "react-router-dom";
import { LandingHeader } from "@/components/blocks/header/LandingHeader";
import { Footer } from "@/components/blocks/footer";

/**
 * LandingLayout - Same header/footer as For Banks and For Individuals.
 * Use for About, Contact (and other public marketing pages) so nav is consistent.
 */
const LandingLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LandingLayout;
