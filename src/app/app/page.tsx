"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mic, History } from "lucide-react";

export default function AppPage() {
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
                i&apos;m not f!cking paying attention
            </h1>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Button asChild className="bg-blue-500 text-black border-2 border-black text-base px-6 py-2 xl:text-lg xl:px-8 xl:py-3 flex items-center gap-2">
              <Link href="#">
                start listener
                <Mic className="h-5 w-5 xl:h-6 xl:w-6" />
              </Link>
            </Button>
            <Button asChild className="bg-white text-black border-2 border-black text-base px-6 py-2 xl:text-lg xl:px-8 xl:py-3 flex items-center gap-2">
              <Link href="#">
                past notes
                <History className="h-5 w-5 xl:h-6 xl:w-6" />
              </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
