
import Hero from "@/components/Hero";
import MarqueeSection from "@/components/MarqueeSection";
import FeaturesSection from "@/components/FeaturesSection";

export default function Home() {
  return (
    <main className="flex flex-col">
      <div className="flex flex-col h-screen">
        <Hero />
        <MarqueeSection />
      </div>
      <FeaturesSection />
    </main>
  );
}
