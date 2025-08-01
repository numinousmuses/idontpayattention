"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import useEmblaCarousel from 'embla-carousel-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleArrowRight } from "lucide-react";

export default function Hero() {
  const router = useRouter();
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

  const [isAlias, setIsAlias] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAlias(window.location.hostname.includes("idontpayattention"));
    }
  }, []);

  return (
    <section className="relative flex-grow w-full flex items-center justify-center overflow-hidden p-4">
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(156, 163, 175, 0.9) 1px, transparent 1px),
            linear-gradient(90deg, rgba(156, 163, 175, 0.9) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <div>
          <h1 className="text-4xl md:text-6xl xl:text-8xl font-bold text-black tracking-tight">
            {isAlias ? "I don’t pay attention to" : "I don’t f!cking pay attention to"}
          </h1>
          <div className="mt-4 xl:mt-8 flex flex-col justify-center items-center gap-2 xl:gap-4">
            {/* Embla Carousel */}
            <div className="overflow-hidden w-full max-w-xs md:max-w-md xl:max-w-lg py-2 md:py-4" ref={emblaRef}>
              <div className="flex">
                {things.map((item, index) => (
                  <div key={index} className="flex-none w-full flex justify-center">
                    <Card className="px-4 py-2 md:px-8 md:py-4 bg-blue-500 shadow-lg border-2 border-black transition-all duration-500">
                      <p className="text-4xl md:text-6xl xl:text-8xl font-bold text-black tracking-tight">
                        {item}
                      </p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 w-full flex flex-col items-center justify-center gap-2 z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <p className="text-lg xl:text-xl text-black">It&apos;s ok, neither do we:</p>
            <Button 
              onClick={() => router.push('/app')}
              className="bg-blue-500 text-black border-2 border-black text-base px-6 py-2 xl:text-lg xl:px-8 xl:py-3 flex items-center gap-2"
            >
              Launch App
              <CircleArrowRight className="h-5 w-5 xl:h-6 xl:w-6" />
            </Button>
          </div>
          <p className="text-xs text-gray-600">or keep scrolling to learn more</p>
        </div>
      </div>
    </section>
  );
} 