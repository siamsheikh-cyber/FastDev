import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ImageToTextTool } from "@/components/tools/ImageToTextTool";
import {
  FileScan,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Zap,
  Cpu,
  Layers,
  HelpCircle,
  Lightbulb,
  FileText,
  ShieldCheck,
  Code2,
} from "lucide-react";

const pageUrl = "https://feardev.vercel.app/tools/image-to-text";

export const metadata: Metadata = {
  title: "Free Image to Text Converter (OCR) Online | FearDev",
  description:
    "Extract clean text and code snippets from images, screenshots, and scanned documents in your browser. Free, client-side Optical Character Recognition (OCR) with zero server uploads.",
  keywords: [
    "image to text converter",
    "free ocr online",
    "extract text from image",
    "picture to text",
    "screenshot to code",
    "client side ocr",
    "tesseract js ocr",
    "photo to text converter",
    "feardev tools",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Free Image to Text Converter (OCR) Online | FearDev",
    description:
      "Convert PNG, JPG, and WEBP images into editable text instantly with 100% private in-browser OCR.",
    url: pageUrl,
    type: "website",
    siteName: "FearDev",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FearDev Image to Text OCR Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image to Text Converter (OCR) Online | FearDev",
    description:
      "Fast, private in-browser OCR to extract text from images and screenshots without server uploads.",
    images: ["/og-image.png"],
  },
};

export default function ImageToTextPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Image to Text Converter",
    url: pageUrl,
    description:
      "A free, client-side Optical Character Recognition (OCR) tool that extracts editable text from images, photos, screenshots, and documents.",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "In-browser Tesseract.js OCR processing",
      "Drag and drop image upload",
      "Real-time progress indicators",
      "Auto-resizing editable text output",
      "One-click copy to clipboard",
      "100% private with zero server uploads",
    ],
  };

  const howToSteps = [
    {
      step: "01",
      title: "Upload or Drop Your Image",
      description:
        "Drag and drop any image file (PNG, JPG, WEBP, BMP, or screenshot) into the upload zone or click to browse files from your computer or phone.",
    },
    {
      step: "02",
      title: "Automatic In-Browser OCR Scanning",
      description:
        "The neural OCR engine analyzes character contours and typography directly inside your web browser with live progress feedback.",
    },
    {
      step: "03",
      title: "Review and Edit Extracted Text",
      description:
        "Inspect the converted text inside the auto-resizing text editor. You can tweak, reformat, or add to the text directly as needed.",
    },
    {
      step: "04",
      title: "Copy or Download Output",
      description:
        "Click 'Copy Extracted Text' to save to your clipboard or download the full converted output as a `.txt` document with one click.",
    },
  ];

  const features = [
    {
      icon: Lock,
      title: "100% Private & In-Browser",
      description:
        "No images or documents are ever uploaded to an external server. All neural OCR recognition runs locally on your device CPU/GPU.",
    },
    {
      icon: Zap,
      title: "Instant Live Processing",
      description:
        "Powered by modern WebAssembly and Tesseract.js for rapid text extraction from high-resolution screenshots and photos.",
    },
    {
      icon: Code2,
      title: "Code Snippet & Text Ready",
      description:
        "Easily capture code blocks, error tracebacks, terminal output, receipts, invoices, and book pages without manual retyping.",
    },
    {
      icon: FileText,
      title: "Universal Format Support",
      description:
        "Works seamlessly with PNG, JPG, JPEG, WEBP, BMP, GIF, and clipboard captures across mobile and desktop devices.",
    },
  ];

  const faqs = [
    {
      q: "Is my image uploaded to any server?",
      a: "No. FearDev performs all OCR computations entirely inside your browser using WebAssembly. Your images never leave your computer or smartphone.",
    },
    {
      q: "What image formats are supported?",
      a: "You can upload PNG, JPG, JPEG, WEBP, BMP, and GIF formats. High contrast and clear typography produce the highest accuracy.",
    },
    {
      q: "Can I extract code snippets from video tutorials or screenshots?",
      a: "Yes! Simply take a screenshot of the code or terminal window and drop it here. FearDev will convert the characters into copyable plain text.",
    },
    {
      q: "Is this OCR tool completely free to use?",
      a: "Yes, this tool is 100% free with unlimited image conversions and no account registration or daily quotas required.",
    },
  ];

  return (
    <main className="min-h-screen pb-20">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <li>
              <Link
                href="/"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </li>
            <li>
              <Link
                href="/#tools"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Tools
              </Link>
            </li>
            <li>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </li>
            <li className="font-semibold text-slate-900 dark:text-slate-200">
              Image to Text (OCR)
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <header className="mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Optical Character Recognition (OCR)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Image to Text Converter (OCR)
          </h1>

          {/* <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Extract editable text and code snippets from screenshots, scanned documents, and photo captures directly inside your browser. Built for developers, freelancers, and students who need instant, secure text recognition without privacy risks or tedious manual retyping.
          </p> */}
        </header>

        {/* Interactive OCR Tool Component */}
        <section aria-label="Image to Text Converter Tool" className="mb-16">
          <ImageToTextTool />
        </section>

        {/* Why This Matters Section */}
        <section className="mb-16 rounded-2xl border border-indigo-100 dark:border-indigo-950 bg-gradient-to-br from-indigo-50/50 via-white to-slate-50/50 dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-900/50 p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-3 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
            <Lightbulb className="w-4 h-4" />
            <span>Why This Tool Matters</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Eliminate Repetitive Retyping with Instant In-Browser OCR
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl text-base sm:text-lg">
            Retyping long text from client screenshots, error stack traces, wireframe mocks, or scanned PDF pages wastes valuable engineering time. FearDev OCR transforms visual images into clean, editable text in seconds—saving you hours of manual transcription while keeping confidential project assets 100% confidential.
          </p>
        </section>

        {/* How to Use Section */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              How to Convert Images to Text in 4 Simple Steps
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Follow this quick workflow to extract text from any picture or screenshot online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {howToSteps.map((item) => (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                    {item.step}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Engineered for Speed, Privacy, and Accuracy
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Experience modern optical character recognition built entirely for the web.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-3 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {faqs.map((faq, i) => (
              <article
                key={i}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2"
              >
                <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                  {faq.q}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.a}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-8 sm:p-10 text-white text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Explore More FearDev Developer & Freelancer Tools
          </h2>
          <p className="text-indigo-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Check out our Case Converter and Fiverr/Upwork Restricted Word Checker to streamline your daily workflow.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/tools/case-converter"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-sm"
            >
              <span>Case Converter</span>
            </Link>
            <Link
              href="/tools/fiverr-word-checker"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
            >
              <span>Fiverr Word Checker</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
