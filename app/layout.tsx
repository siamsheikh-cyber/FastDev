import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fastdev.tools";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#090d16" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/feardev.jpg",
    shortcut: "/feardev.jpg",
    apple: "/feardev.jpg",
  },
  title: {
    default: "FastDev — Modern Developer & Freelancer Utility Toolkit",
    template: "%s | FastDev",
  },
  description:
    "FastDev is a fast, lightweight, and privacy-focused online toolkit featuring developer utilities, text transformers, OCR image text extractors, and freelancer word checkers.",
  keywords: [
    "developer tools",
    "freelancer utilities",
    "case converter",
    "text case transformer",
    "image to text",
    "OCR online",
    "Fiverr word checker",
    "Upwork word checker",
    "online utility toolkit",
    "fastdev",
  ],
  authors: [{ name: "FastDev Team", url: siteUrl }],
  creator: "FastDev",
  publisher: "FastDev",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "FastDev",
    title: "FastDev — Modern Developer & Freelancer Utility Toolkit",
    description:
      "A fast, lightweight, and privacy-focused online toolkit for developers and freelancers. Instant text conversion, OCR tools, and freelance compliance checkers.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FastDev Developer Utility Toolkit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FastDev — Modern Developer & Freelancer Utility Toolkit",
    description:
      "A fast, lightweight, and privacy-focused online toolkit for developers and freelancers.",
    images: ["/og-image.png"],
    creator: "@fastdev_tools",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-400">
        <ThemeProvider>
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
