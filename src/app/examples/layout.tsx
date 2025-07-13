import type { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const hostname = headersList.get('host') || '';
  const isAlias = hostname.includes('idontpayattention');
  
  return {
    title: isAlias ? "Examples - I don't pay attention" : "Examples - I don't fucking pay attention",
    description: "See sample notes and examples of AI-powered meeting transcription",
  };
}

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 