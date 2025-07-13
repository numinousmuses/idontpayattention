import { Card } from "@/components/ui/card";
import { FileText, HardDrive, Share2, Download, Sparkles } from "lucide-react";

export default function ForeverFreeSection() {
  const features = [
    {
      icon: FileText,
      title: "Unlimited notes",
      subtitle: "Create as many notes as you need without any limits"
    },
    {
      icon: HardDrive,
      title: "Browser storage",
      subtitle: "Notes are stored in your browser/on-device for privacy"
    },
    {
      icon: Share2,
      title: "Share notes",
      subtitle: "Shared notes are available for 48 hours"
    },
    {
      icon: Download,
      title: "Export notes",
      subtitle: "Copy as text, export as PDFs, or copy as markdown for Notion, GitHub, Obsidian, etc"
    },
    {
      icon: Sparkles,
      title: "Edit notes with AI",
      subtitle: "Polish your auto-generated notes with smart AI editing. Fix formatting, add clarity, or restructure content without starting from scratch."
    }
  ];

  // Duplicate features for seamless loop
  const extendedFeatures = [...features, ...features];

  return (
    <section className="w-full py-24 bg-blue-500 relative border-t-2 border-b-2 border-black">
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(white 1px, transparent 1px),
            linear-gradient(90deg, white 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="px-4 mb-12 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-black">
          Forever free, you get:
        </h2>
      </div>
      
      {/* Marquee-style card carousel */}
      <div className="relative flex w-full overflow-x-hidden z-10">
          <div className="animate-marquee whitespace-nowrap py-12 flex items-center">
            {extendedFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const bgColor = index % 2 === 0 ? "bg-blue-100" : "bg-white";
              return (
                <Card key={index} className={`w-96 h-64 p-6 ${bgColor} border-2 border-black shadow-lg flex-shrink-0 flex flex-col justify-center mx-4`}>
                  <div className="mb-2">
                    <Icon size={40} className="text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-1 whitespace-normal break-words">
                    {feature.title}
                  </h3>
                  <p className="text-base leading-normal text-black whitespace-normal break-words">
                    {feature.subtitle}
                  </p>
                </Card>
              );
            })}
          </div>
          
          <div className="absolute top-0 animate-marquee2 whitespace-nowrap py-12 flex items-center">
            {extendedFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const bgColor = index % 2 === 0 ? "bg-blue-300" : "bg-blue-200";
              return (
                <Card key={`duplicate-${index}`} className={`w-96 h-64 p-6 ${bgColor} border-2 border-black shadow-lg flex-shrink-0 flex flex-col justify-center mx-4`}>
                  <div className="mb-2">
                    <Icon size={40} className="text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-1 whitespace-normal break-words">
                    {feature.title}
                  </h3>
                  <p className="text-base leading-normal text-black whitespace-normal break-words">
                    {feature.subtitle}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
    </section>
  );
}