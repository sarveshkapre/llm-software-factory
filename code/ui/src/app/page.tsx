import { Atmosphere } from "@/components/layout/atmosphere";
import { CtaSection } from "@/components/sections/cta-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ModuleGridSection } from "@/components/sections/module-grid-section";
import { PrinciplesSection } from "@/components/sections/principles-section";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Atmosphere />
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-10 sm:gap-16 sm:px-8 sm:py-14 lg:gap-20 lg:px-12 lg:py-16">
        <HeroSection />
        <ModuleGridSection />
        <PrinciplesSection />
        <CtaSection />
      </main>
    </div>
  );
}
