import type { Metadata } from "next";
import { getSampleNote } from "@/lib/sample-notes";
import { headers } from "next/headers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ exampleslug: string }>;
}): Promise<Metadata> {
  const { exampleslug } = await params;
  const headersList = await headers();
  const hostname = headersList.get('host') || '';
  const isAlias = hostname.includes('idontpayattention');
  
  const baseTitle = isAlias ? "I don't pay attention" : "I don't fucking pay attention";
  
  try {
    const note = getSampleNote(exampleslug);
    
    if (note) {
      return {
        title: `${note.title} - ${baseTitle}`,
        description: `Sample meeting note demonstrating AI-powered transcription and note-taking`,
      };
    }
  } catch (error) {
    console.error("Error fetching sample note for metadata:", error);
  }
  
  // Fallback metadata if note not found or error
  return {
    title: `Example - ${baseTitle}`,
    description: "View sample meeting notes and see how AI-powered transcription works",
  };
}

export default function ExampleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 