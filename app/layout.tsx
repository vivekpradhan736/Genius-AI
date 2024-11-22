import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from "@/components/myComps/modal-provider";
import { Toaster } from "@/components/ui/sonner";
import ToasterProvider from "@/components/myComps/ToasterProvider";
import CrispProvider from "@/components/myComps/crisp-provider";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Genius",
  description: "AI Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <CrispProvider />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ModalProvider />
        <ToasterProvider />
        {children}
        <Toaster/>
      </body>
    </html>
    </ClerkProvider>
  );
}
