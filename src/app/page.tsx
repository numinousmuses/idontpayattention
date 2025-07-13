
import Hero from "@/components/Hero";
import MarqueeSection from "@/components/MarqueeSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ForeverFreeSection from "@/components/ForeverFreeSection";
// import ProPlanSection from "@/components/ProPlanSection";
import EnjoySection from "@/components/EnjoySection";

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
      {/* <ProPlanSection /> */}
      <EnjoySection />
    </main>
  );
}
