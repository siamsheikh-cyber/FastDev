import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ImageFormatConverterTool } from "@/components/tools/ImageFormatConverterTool";
import {
  Image as ImageIcon,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Zap,
  Cpu,
  Layers,
  HelpCircle,
  Lightbulb,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Maximize2,
  FileSpreadsheet,
} from "lucide-react";

const pageUrl = "https://fastdev.tools/tools/image-format-converter";

export const metadata: Metadata = {
  title: "Free Online Image Format Converter – JPEG, PNG, WEBP | FearDev",
  description:
    "Convert images instantly between JPEG, PNG, and WEBP formats directly in your browser. 100% private, client-side image converter with custom compression quality and zero server uploads.",
  keywords: [
    "image format converter",
    "png to webp converter",
    "jpg to webp converter",
    "convert image to png",
    "convert image to jpeg",
    "online image converter free",
    "client side image converter",
    "webp converter online",
    "compress image online",
    "feardev tools",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Free Online Image Format Converter – JPEG, PNG, WEBP | FearDev",
    description:
      "Transform JPG, PNG, and WEBP images in seconds with native browser Canvas processing. 100% private, fast, and free.",
    url: pageUrl,
    type: "website",
    siteName: "FearDev",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FearDev Image Format Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Image Format Converter – JPEG, PNG, WEBP | FearDev",
    description:
      "Fast, private in-browser image format converter. Convert between PNG, JPEG, and WEBP without server uploads.",
    images: ["/og-image.png"],
    creator: "@feardev_tools",
  },
};

export default function ImageFormatConverterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Image Format Converter",
    url: pageUrl,
    description:
      "A free, client-side image format converter that transforms images between JPEG, PNG, and WEBP formats with custom quality settings.",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "In-browser HTML5 Canvas image conversion",
      "Convert between JPEG, PNG, and WEBP formats",
      "Adjustable compression quality slider (10-100%)",
      "Real-time file size savings comparison",
      "Side-by-side Before/After preview",
      "Instant one-click file download",
      "100% private with zero server uploads",
    ],
  };

  const howToSteps = [
    {
      step: "01",
      title: "Upload or Drop Your Image",
      description:
        "Drag and drop any image file (JPG, PNG, WEBP, GIF, BMP, or SVG) into the upload box, or click to browse files from your computer or mobile device.",
    },
    {
      step: "02",
      title: "Choose Target Output Format",
      description:
        "Select your preferred output format: WEBP for modern high-efficiency web delivery, PNG for lossless graphics with transparency, or JPEG for universal photo compatibility.",
    },
    {
      step: "03",
      title: "Adjust Quality & Compare File Sizes",
      description:
        "For JPEG and WEBP, dial in your target compression quality slider to balance visual fidelity and file weight. View the live file size savings badge.",
    },
    {
      step: "04",
      title: "Download Converted Image",
      description:
        "Click the download button to instantly save your converted image with the appropriate file extension. No waiting in upload queues.",
    },
  ];

  const formatComparison = [
    {
      format: "WEBP",
      transparency: "Yes (Full Alpha)",
      compression: "Lossy & Lossless",
      fileSize: "Smallest (25-35% lighter than JPEG/PNG)",
      bestFor: "Websites, blogs, apps, Core Web Vitals optimization",
    },
    {
      format: "PNG",
      transparency: "Yes (Full Alpha)",
      compression: "Lossless Deflate",
      fileSize: "Larger",
      bestFor: "Logos, screenshots, UI icons, sharp graphics with transparency",
    },
    {
      format: "JPEG / JPG",
      transparency: "No (Solid background)",
      compression: "Lossy DCT",
      fileSize: "Compact & Variable",
      bestFor: "Complex photography, printing, legacy software compatibility",
    },
  ];

  const faqs = [
    {
      q: "Are my uploaded images saved or sent to a server?",
      a: "No, never. The conversion is performed 100% locally inside your browser using the native HTML5 Canvas API. Your files never touch any remote server or third-party cloud storage, making it completely safe for confidential client files and private screenshots.",
    },
    {
      q: "Why should I convert PNG images to WEBP?",
      a: "WEBP offers superior compression compared to PNG while retaining transparency and high visual sharpness. Converting web graphics to WEBP typically reduces file size by 50% to 80%, significantly speeding up website page loads and improving Google Core Web Vitals scores.",
    },
    {
      q: "What happens to transparent backgrounds when converting to JPEG?",
      a: "Because the JPEG specification does not support alpha transparency, transparent pixels are automatically filled with a clean solid background (white by default, or selectable black). If you need to preserve transparency, choose WEBP or PNG instead.",
    },
    {
      q: "Is there any file size limit or daily conversion limit?",
      a: "No! Since all processing is executed locally by your computer's browser, there are no artificial file size caps, queue delays, watermarks, or daily conversion limits.",
    },
  ];

  return (
    <main className="flex-1 min-h-screen py-8 sm:py-12 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/#tools" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Tools
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 dark:text-slate-200 font-semibold" aria-current="page">
            Image Format Converter
          </span>
        </nav>

        {/* Page Header Section */}
        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Fast Client-Side Media Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Image Format Converter
          </h1>

          {/*<p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Convert images seamlessly between <strong className="font-semibold text-slate-800 dark:text-slate-200">JPEG, PNG, and WEBP</strong> formats with adjustable compression quality. Designed for developers, designers, and freelancers who need quick, high-fidelity asset conversions without uploading sensitive client media to third-party web servers.
          </p> */}

          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3.5 py-1.5 rounded-xl w-fit">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Privacy Guaranteed: Your images never leave your browser.</span>
          </div>
        </header>

        {/* Interactive Converter Tool Container */}
        <section aria-label="Interactive Image Format Converter Tool">
          <ImageFormatConverterTool />
        </section>

        {/* How to Use Section */}
        <section className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800/80">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>How to Convert Images in 4 Easy Steps</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Follow these simple steps to transform and compress your graphics right in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {howToSteps.map((item) => (
              <div
                key={item.step}
                className="relative p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/50 dark:border-indigo-800/50 inline-block">
                    STEP {item.step}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Image Format Conversion Matters */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-indigo-500" />
              <span>Why Format Conversion & Compression Matters</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Choosing the right file format can drastically reduce bandwidth usage, enhance user experience, and protect confidential assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Faster Page Speeds & SEO
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Converting heavy PNG screenshots and graphics to modern WEBP format cuts file weight by 30% to 80% with near-zero perceptual loss. Lighter pages load instantly, improving Google Core Web Vitals and organic rankings.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Zero Cloud Upload Risk
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Traditional online converters upload your files to remote servers where they may be stored or logged. FearDev processes everything strictly within browser memory using HTML5 Canvas API—perfect for private client contracts and mockups.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Universal Compatibility
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Need to share photos with legacy software, email clients, or print services that don&apos;t support WEBP? Quickly convert back to standard JPEG or lossless PNG with a single click.
              </p>
            </div>
          </div>
        </section>

        {/* Supported Formats Comparison Table */}
        <section className="space-y-5">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <FileSpreadsheet className="w-5 h-5 text-indigo-500" />
              <span>Image Format Comparison Guide</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Quick breakdown of JPEG vs PNG vs WEBP features, transparency support, and optimal use cases.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3.5 sm:p-4">Format</th>
                  <th className="p-3.5 sm:p-4">Transparency</th>
                  <th className="p-3.5 sm:p-4">Compression Type</th>
                  <th className="p-3.5 sm:p-4">Average Size</th>
                  <th className="p-3.5 sm:p-4">Ideal Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
                {formatComparison.map((row) => (
                  <tr key={row.format} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-slate-900 dark:text-white">
                      {row.format}
                    </td>
                    <td className="p-3.5 sm:p-4">{row.transparency}</td>
                    <td className="p-3.5 sm:p-4">{row.compression}</td>
                    <td className="p-3.5 sm:p-4 font-medium text-indigo-600 dark:text-indigo-400">
                      {row.fileSize}
                    </td>
                    <td className="p-3.5 sm:p-4">{row.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              <span>Frequently Asked Questions</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Answers to common questions about client-side format conversion, image compression, and file security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400 shrink-0 font-mono">Q:</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Explore Other Tools CTA */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl shadow-indigo-950/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Explore More Developer & Freelance Utilities
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl leading-relaxed">
              Supercharge your daily workflow with our in-browser OCR image-to-text extractor, programming case transformer, and freelance word safety checker.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/tools/image-to-text"
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 transition-colors shadow-sm inline-flex items-center gap-1.5"
            >
              <span>Image to Text (OCR)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/tools/case-converter"
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-indigo-800/80 hover:bg-indigo-800 text-white border border-indigo-700/80 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Case Converter</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
