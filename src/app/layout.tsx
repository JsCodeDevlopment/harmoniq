import type { Metadata } from "next";
import { JetBrains_Mono, Outfit, Geist } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harmoniq | Cifras Limpas para o Louvor",
  description: "Acesse cifras de louvores sem anúncios, modo performance e transposição instantânea.",
};

import { ReactQueryProvider } from "@/providers/query-client-provider";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn("h-full", "antialiased", "dark", outfit.variable, jetbrainsMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500/30">
        <ReactQueryProvider>
            {children}
            <Toaster richColors position="top-right" closeButton theme="dark" />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
