import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  Type,
  FileScan,
  ShieldCheck,
  ArrowRight,
  Zap,
  Lock,
  Cpu,
  Layers,
  Clock,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "FastDev — Developer & Freelancer Utility Toolkit",
  description:
    "FastDev delivers instant, client-side utilities for developers and freelancers: Text Case Converters, OCR Image to Text, and Fiverr/Upwork Word Checkers.",
  alternates: {
    canonical: "/",
  },
};

const toolList = [
  {
    id: "case-converter",
    title: "Text Case Converter",
    category: "Text Utilities",
    description:
      "Transform text and variables across camelCase, PascalCase, kebab-case, snake_case, CONSTANT_CASE, sentence case, and clean URL slugs in real-time.",
    icon: Type,
    status: "Live & Ready",
    isAvailable: true,
    href: "/tools/case-converter",
    gradient: "from-blue-500 to-indigo-600",
    badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/50",
    features: ["One-click copy", "Multiple programming naming cases", "Bulk line conversion"],
  },
  {
    id: "image-to-text",
    title: "Image to Text (OCR)",
    category: "Media & Vision",
    description:
      "Extract editable text and code snippets from screenshots, scans, and images directly in your browser with zero server uploads.",
    icon: FileScan,
    status: "Coming Soon",
    isAvailable: false,
    href: "#tools",
    gradient: "from-indigo-500 to-violet-600",
    badgeColor: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50",
    features: ["Local in-browser OCR", "Image drag & drop", "Preserves formatting"],
  },
  {
    id: "fiverr-word-checker",
    title: "Fiverr/Upwork Word Checker",
    category: "Freelance Suite",
    description:
      "Detect forbidden keywords, contact exchange triggers, and terms of service red flags before sending proposals or client messages.",
    icon: ShieldCheck,
    status: "Live & Ready",
    isAvailable: true,
    href: "/tools/fiverr-word-checker",
    gradient: "from-emerald-500 to-teal-600",
    badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50",
    features: ["Direct contact warnings", "TOS trigger highlight", "Instant safety rating"],
  },
];

const highlights = [
  {
    icon: Zap,
    title: "Instant & Zero Latency",
    description: "Built for speed with zero overhead. Perform transformations without sluggish page reloads.",
  },
  {
    icon: Lock,
    title: "100% Privacy Focused",
    description: "Processing happens locally on your client machine. Your sensitive text and images stay private.",
  },
  {
    icon: Cpu,
    title: "Developer & Freelancer Centric",
    description: "Tailored utilities designed specifically to solve everyday workflow friction points.",
  },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "FastDev",
    url: "https://fastdev.tools",
    description:
      "A developer and freelancer utility toolkit offering Text Case Conversion, OCR Image to Text, and Freelance Marketplace Word Checking.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <main className="flex-1 w-full bg-grid-pattern">
      {/* Structured JSON-LD Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Modern Developer & Freelancer Toolkit</span>
            </div>

            {/* Single H1 Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Essential Utilities for{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Developers & Freelancers
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Supercharge your daily workflow with lightweight, privacy-focused online tools.
              Format code cases, extract image text, and safeguard freelance proposals with zero friction.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                href="/tools/case-converter"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all duration-200"
              >
                <span>Launch Case Converter</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#tools"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-200"
              >
                <span>Browse All Tools</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-16 md:py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Toolkit Directory</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Developer & Freelancer Tools
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
              Select a utility below to start transforming text, extracting content, or auditing proposals immediately.
            </p>
          </div>

          {/* 3 Tool Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {toolList.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  className={`group relative flex flex-col justify-between rounded-2xl border bg-white dark:bg-slate-900/90 p-6 sm:p-7 shadow-sm transition-all duration-300 ${
                    tool.isAvailable
                      ? "border-indigo-200 dark:border-indigo-900/60 shadow-md shadow-indigo-500/5 hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500 ring-1 ring-indigo-500/10"
                      : "border-slate-200/90 dark:border-slate-800/90 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  {/* Top Row: Icon & Status Badge */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr ${tool.gradient} text-white shadow-md`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      {tool.isAvailable ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {tool.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                          <Clock className="w-3 h-3" />
                          {tool.status}
                        </span>
                      )}
                    </div>

                    {/* Category */}
                    <div className="pt-2">
                      <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md border ${tool.badgeColor}`}>
                        {tool.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {tool.isAvailable ? (
                        <Link href={tool.href} className="focus:outline-none">
                          <span className="absolute inset-0 z-0" aria-hidden="true" />
                          {tool.title}
                        </Link>
                      ) : (
                        tool.title
                      )}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {tool.description}
                    </p>

                    {/* Feature bullet points */}
                    <ul className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800/60">
                      {tool.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Bottom / Action */}
                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 relative z-10">
                    {tool.isAvailable ? (
                      <Link
                        href={tool.href}
                        className="flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300"
                      >
                        <span className="font-mono text-[11px] bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200/50 dark:border-indigo-800/50">
                          {tool.href}
                        </span>
                        <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Open Tool &rarr;
                        </span>
                      </Link>
                    ) : (
                      <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                        <span>Route: <code className="font-mono text-[11px]">/tools/{tool.id}</code></span>
                        <span>In Development</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Engineered for Seamless Productivity
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              No paywalls, no tracking scripts, no complicated configuration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 p-6 backdrop-blur-sm shadow-sm"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
