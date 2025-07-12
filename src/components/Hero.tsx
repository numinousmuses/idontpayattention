"use client";

import { useEffect, useCallback } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleArrowRight } from "lucide-react";

export default function Hero() {
  const things = ["meetings", "lectures", "videos"];

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps'
  });

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      scrollNext();
    }, 2500); // Change every 2.5 seconds

    return () => clearInterval(interval);
  }, [emblaApi, scrollNext]);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(156, 163, 175, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(156, 163, 175, 0.7) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <div>
          <h1 className="text-6xl md:text-8xl font-bold text-black tracking-tight">
            I don&apos;t f!cking pay attention
          </h1>
          <div className="mt-8 flex flex-row justify-center items-center gap-4">
            <span className="text-6xl md:text-8xl font-bold text-black tracking-tight">
              to
            </span>
            
            {/* Embla Carousel */}
            <div className="overflow-hidden w-full max-w-lg py-4" ref={emblaRef}>
              <div className="flex">
                {things.map((item, index) => (
                  <div key={index} className="flex-none w-full flex justify-center">
                    <Card className="px-8 py-4 bg-blue-500 shadow-lg border-2 border-black transition-all duration-500">
                      <p className="text-6xl md:text-8xl font-bold text-black tracking-tight">
                        {item}
                      </p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 w-full flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-4">
            <p className="text-xl md:text-2xl text-black">It&apos;s ok, neither do we</p>
            <Button className="bg-blue-500 text-black border-2 border-black text-lg px-8 py-3 flex items-center gap-2">
              Launch App
              <CircleArrowRight className="h-6 w-6" />
            </Button>
          </div>
          <p className="text-xs text-gray-600">or keep scrolling to learn more</p>
        </div>
      </div>
    </section>
  );
} 