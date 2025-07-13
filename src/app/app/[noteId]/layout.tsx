import type { Metadata } from "next";
import { getNote } from "@/lib/database";
import { headers } from "next/headers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ noteId: string }>;
}): Promise<Metadata> {
  const { noteId } = await params;
  const headersList = await headers();
  const hostname = headersList.get('host') || '';
  const isAlias = hostname.includes('idontpayattention');
  
  const baseTitle = isAlias ? "I don't pay attention" : "I don't fucking pay attention";
  
  try {
    const note = await getNote(noteId);
    
    if (note) {
      return {
        title: `${note.title} - ${baseTitle}`,
        description: `Meeting note from ${note.createdAt.toLocaleDateString()} - AI-powered transcription`,
      };
    }
  } catch (error) {
    console.error("Error fetching note for metadata:", error);
  }
  
  // Fallback metadata if note not found or error
  return {
    title: `Note - ${baseTitle}`,
    description: "View and edit your meeting note with AI-powered transcription",
  };
}

export default function NoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 