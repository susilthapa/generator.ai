import type { Metadata } from "next";
import { Lexend } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { AppProvider } from "@/components/Provider";
import { Toaster } from "@/components/ui/toaster";

const lexend = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Generator AI",
  description: "AI tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(lexend.className, "antialiased min-h-screen pt-16")}>
        <AppProvider>
          <Navbar />
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
