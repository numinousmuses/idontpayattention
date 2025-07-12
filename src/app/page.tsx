
import Hero from "@/components/Hero";
import MarqueeSection from "@/components/MarqueeSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ForeverFreeSection from "@/components/ForeverFreeSection";

export default function Home() {
  return (
    <main className="flex flex-col">
      <div className="flex flex-col h-screen">
        <Hero />
        <MarqueeSection />
      </div>
      <FeaturesSection />
      <HowItWorksSection />
      <ForeverFreeSection />
    </main>
  );
}
