"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, Link, EyeOff, FileX, Database, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProPlanSection() {
  const router = useRouter();

  const features = [
    {
      icon: Cloud,
      title: "Notes stored in cloud",
      subtitle: "Access your notes from anywhere, anytime. No more lost transcriptions when you switch devices or clear your browser."
    },
    {
      icon: Link,
      title: "Unlimited permanent shared notes",
      subtitle: "Share notes that never expire. Send links that work forever, not just for 48 hours like the free version."
    },
    {
      icon: EyeOff,
      title: "No ads",
      subtitle: "Clean, distraction-free interface. Just you and your notes, without promotional clutter getting in the way."
    },
    {
      icon: FileX,
      title: "No watermark on exported notes",
      subtitle: "Professional-looking outputs without our branding. Your notes look like they came from you, not us."
    },
    {
      icon: Database,
      title: "Knowledge Vault",
      subtitle: "Your notes become searchable long-term memory. Ask questions across all your transcriptions and get instant, intelligent answers."
    },
    {
      icon: Users,
      title: "Collaborative editing",
      subtitle: "Share editing access with teammates. Multiple people can refine and improve notes together in real-time."
    }
  ];

  // Duplicate features for seamless loop
  const extendedFeatures = [...features, ...features];

  const handleProPlanClick = () => {
    router.push('/pro');
  };

  return (
    <section className="w-all py-24 bg-blue-50 relative border-t-2 border-b-2 border-black">
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(156, 163, 175, 0.9) 1px, transparent 1px),
            linear-gradient(90deg, rgba(156, 163, 175, 0.9) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="px-4 mb-12 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-black">
          If these features sound good to you:
        </h2>
      </div>
      
      {/* Marquee-style card carousel */}
      <div className="relative flex w-full overflow-x-hidden z-10">
          <div className="animate-marquee whitespace-nowrap py-12 flex items-center">
            {extendedFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const bgColor = index % 2 === 0 ? "bg-blue-400" : "bg-blue-300";
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
              const bgColor = index % 2 === 0 ? "bg-blue-400" : "bg-blue-300";
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

      {/* Centered pro plan button */}
      <div className="px-4 flex justify-center relative z-10">
        <Button 
          onClick={handleProPlanClick}
          className="bg-blue-500 text-black border-2 border-black text-lg px-8 py-4 flex items-center gap-2 transition-colors"
        >
          Check out our pro plan
        </Button>
      </div>
    </section>
  );
} 