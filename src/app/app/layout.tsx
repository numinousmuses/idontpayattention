import type { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const hostname = headersList.get('host') || '';
  const isAlias = hostname.includes('idontpayattention');
  
  return {
    title: isAlias ? "App - I don't pay attention" : "App - I don't fucking pay attention",
    description: "Create and manage your meeting notes with AI-powered transcription",
  };
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 