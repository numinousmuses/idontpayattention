"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CircleArrowRight, Github } from "lucide-react";
import { useState, useEffect } from "react";

export default function EnjoySection() {
  const [isAlias, setIsAlias] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAlias(window.location.hostname.includes("idontpayattention"));
    }
  }, []);

  const hashtag = isAlias ? "#idontpayattention" : "#idontfuckingpayattention";
  return (
    <section className="relative flex-grow w-full flex flex-col items-center justify-center overflow-hidden p-4 h-screen">
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
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center gap-8">
        <div className="flex flex-col items-center gap-4">
            <h1 className="text-4xl md:text-6xl xl:text-8xl font-bold text-black tracking-tight">
                Enjoy not paying attention!
            </h1>
            <p className="text-lg xl:text-xl text-gray-600">
                tweet your notes with {hashtag}
            </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Button asChild className="bg-blue-500 text-black border-2 border-black text-base px-6 py-2 xl:text-lg xl:px-8 xl:py-3 flex items-center gap-2">
              <Link href="/app">
                Try it now
                <CircleArrowRight className="h-5 w-5 xl:h-6 xl:w-6" />
              </Link>
            </Button>
            <Button asChild className="bg-white text-black border-2 border-black text-base px-6 py-2 xl:text-lg xl:px-8 xl:py-3 flex items-center gap-2">
              <Link href="/examples">
                See sample notes
                <CircleArrowRight className="h-5 w-5 xl:h-6 xl:w-6" />
              </Link>
            </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-10 w-full flex items-center justify-center gap-4 z-10">
        <Button asChild className="bg-blue-300 text-black border-2 border-black text-sm px-4 py-2">
          <Link href="https://tally.so/r/wMZx8g" target="_blank" rel="noopener noreferrer">
            Contact us
          </Link>
        </Button>
        <Button asChild className="bg-blue-400 border-2 border-black text-sm px-4 py-2">
          <Link href="https://tally.so/r/wzB6W8" target="_blank" rel="noopener noreferrer">
            Advertise with us
          </Link>
        </Button>
      </footer>

      {/* GitHub icon */}
      <Link 
        href="https://github.com/numinousmuses/idontpayattention" 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 p-2 text-gray-600 hover:text-black transition-colors z-10"
      >
        <Github className="h-6 w-6" />
      </Link>
    </section>
  );
} 