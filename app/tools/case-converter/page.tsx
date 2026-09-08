import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CaseConverterTool } from "@/components/tools/CaseConverterTool";
import {
  Type,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  Sparkles,
  CheckCircle2,
  FileCheck2,
  Share2,
  Code2,
} from "lucide-react";

const pageUrl = "https://feardev.vercel.app/tools/case-converter";

export const metadata: Metadata = {
  title: "Text Case Converter",
  description:
    "Instantly convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, and slug formats online. Free, fast, privacy-friendly text transformer for developers, freelancers, and writers.",
  keywords: [
    "text case converter",
    "uppercase converter",
    "lowercase converter",
    "title case converter",
    "sentence case tool",
    "capitalize each word",
    "camelCase converter",
    "snake_case generator",
    "online text formatter",
    "feardev tools",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Text Case Converter | FearDev",
    description:
      "Transform strings, headings, and code identifiers into any text case instantly. 100% free and client-side private.",
    url: pageUrl,
    type: "website",
    siteName: "FearDev",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FearDev Text Case Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Case Converter | FearDev",
    description:
      "Transform text between UPPERCASE, lowercase, Title Case, Sentence case, and camelCase with live character counters.",
    images: ["/og-image.png"],
  },
};

export default function CaseConverterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Text Case Converter",
    url: pageUrl,
    description:
      "An instant online text case conversion utility for uppercase, lowercase, title case, sentence case, and programming identifier cases.",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "UPPERCASE conversion",
      "lowercase conversion",
      "Title Case capitalization",
      "Sentence case formatting",
      "Live word and character count",
      "One-click clipboard copy",
    ],
  };

  const howToSteps = [
    {
      step: "01",
      title: "Paste or Type Your Text",
      description:
        "Input your text directly into the conversion box, or click 'Paste' to load text directly from your clipboard.",
    },
    {
      step: "02",
      title: "Select Desired Case Style",
      description:
        "Click any format button—such as UPPERCASE, lowercase, Title Case, or Sentence case—to transform your text instantly in real-time.",
    },
    {
      step: "03",
      title: "Inspect Character & Word Metrics",
      description:
        "Review real-time stats including total character count, non-space character count, total word count, and line breakdown.",
    },
    {
      step: "04",
      title: "Copy to Clipboard",
      description:
        "Click 'Copy to Clipboard' to grab your converted text and paste it into your IDE, client document, or content editor.",
    },
  ];

  return (
    <main className="flex-1 w-full bg-grid-pattern pb-16 md:pb-24">
      {/* Structured JSON-LD Data for SEO */}
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
            <li className="font-semibold text-slate-800 dark:text-slate-200">
              Text Case Converter
            </li>
          </ol>
        </nav>

        {/* Page Header / Intro */}
        <header className="mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm">
            <Type className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Text Utilities Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Text Case Converter
          </h1>

          {/*  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            FearDev Text Case Converter is a high-speed string transformation tool tailored for developers, freelancers, and content writers. Convert text between UPPERCASE, lowercase, Title Case, Sentence case, and programming identifier cases with instant client-side execution and zero data collection.
          </p> */}
        </header>

        {/* The Interactive Tool Section */}
        <section aria-label="Text Case Converter Tool" className="mb-16">
          <CaseConverterTool />
        </section>

        {/* Explanatory & SEO Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* How To Use Section */}
          <section
            aria-labelledby="how-to-use-heading"
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-8 backdrop-blur-sm shadow-sm"
          >
            <div className="flex items-center gap-2.5 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h2
                id="how-to-use-heading"
                className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                How to Use the Text Case Converter
              </h2>
            </div>

            <div className="space-y-4">
              {howToSteps.map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold shrink-0 mt-0.5">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Why This Matters Section */}
          <section
            aria-labelledby="why-matters-heading"
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/80 p-6 sm:p-8 backdrop-blur-sm shadow-sm"
          >
            <div className="flex items-center gap-2.5 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h2
                id="why-matters-heading"
                className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                Why Text Case Formatting Matters
              </h2>
            </div>

            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                Inconsistent capitalization is one of the most common friction points when handling client deliverables, writing blog headlines, or cleaning up scraped web content. Manually rewriting mixed uppercase sentences or converting title tags takes valuable time and leads to human error.
              </p>
              <p>
                For developers and designers, transforming human-readable titles into clean code constants (<code className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">CONSTANT_CASE</code>), camelCase variables, or URL slugs is essential for clean codebase architecture and SEO consistency.
              </p>
              <p>
                FearDev executes all text operations directly in your browser with zero network transmission, providing guaranteed privacy and instantaneous performance.
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Fixes accidental Caps Lock</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Formats blog post titles</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Cleans messy client copy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Generates code identifiers</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Case Reference Glossary Section */}
        <section
          aria-labelledby="case-styles-heading"
          className="mt-12 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/60 dark:bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm"
        >
          <h2
            id="case-styles-heading"
            className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-4"
          >
            Overview of Supported Case Formats
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
              <strong className="block font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">
                UPPERCASE
              </strong>
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                Converts all characters to capital letters.
              </p>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">
                EXAMPLE TEXT STRING
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
              <strong className="block font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">
                lowercase
              </strong>
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                Converts all characters to small letters.
              </p>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">
                example text string
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
              <strong className="block font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">
                Title Case
              </strong>
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                Capitalizes the first character of each word.
              </p>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">
                Example Text String
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
              <strong className="block font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">
                Sentence case
              </strong>
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                Capitalizes the first letter of each sentence.
              </p>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">
                Example text string.
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
