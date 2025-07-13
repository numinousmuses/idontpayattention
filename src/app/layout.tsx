import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import 'regenerator-runtime/runtime';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { headers } from "next/headers";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const hostname = headersList.get('host') || '';
  const isAlias = hostname.includes('idontpayattention');
  
  return {
    title: isAlias ? "I don't pay attention" : "I don't fucking pay attention",
    description: "zone out during meetings",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
