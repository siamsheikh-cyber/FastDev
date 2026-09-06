import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { FiverrWordCheckerTool } from "@/components/tools/FiverrWordCheckerTool";
import {
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Lock,
  MessageSquareCode,
  ShieldAlert,
  ArrowRight,
  BookOpen,
} from "lucide-react";

const pageUrl = "https://fastdev.tools/tools/fiverr-word-checker";

export const metadata: Metadata = {
  title: "Fiverr & Upwork Restricted Word Checker – Write Safe Messages | FastDev",
  description:
    "Check your freelance client messages and proposals against Fiverr and Upwork Terms of Service (TOS) restricted words. Detect forbidden contact sharing, off-platform payment triggers, and rating solicitations with instant safe alternatives.",
  keywords: [
    "fiverr restricted words",
    "upwork forbidden keywords",
    "fiverr word checker",
    "freelance message checker",
    "fiverr tos compliance",
    "upwork proposal safety tool",
    "avoid fiverr warnings",
    "freelance client chat filter",
    "fiverr word rephraser",
    "fastdev tools",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Fiverr & Upwork Restricted Word Checker – Write Safe Messages | FastDev",
    description:
      "Avoid account warnings and bans on Fiverr and Upwork. Detect forbidden contact exchange, external payment mentions, and TOS triggers in real-time.",
    url: pageUrl,
    type: "website",
    siteName: "FastDev",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FastDev Fiverr and Upwork Restricted Word Checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiverr & Upwork Restricted Word Checker – Write Safe Messages | FastDev",
    description:
      "Detect forbidden keywords and contact sharing triggers before sending client messages or proposals on Fiverr and Upwork.",
    images: ["/og-image.png"],
    creator: "@fastdev_tools",
  },
};

export default function FiverrWordCheckerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Fiverr & Upwork Restricted Word Checker",
    url: pageUrl,
    description:
      "A client-side compliance tool for freelancers to scan messages and proposals for terms that violate Fiverr and Upwork Terms of Service, providing compliant phrasing suggestions.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Real-time restricted keyword scanning",
      "Interactive visual highlighted preview",
      "Automatic character spacing fix",
      "Category-grouped compliance recommendations",
      "Platform-safe phrasing alternatives",
      "100% private client-side processing",
    ],
  };

  const howToSteps = [
    {
      step: "01",
      title: "Paste or Type Your Client Message",
      description:
        "Draft or paste your proposal, gig description, inbox reply, or custom offer into the message input area.",
    },
    {
      step: "02",
      title: "Review Visual Word Highlights",
      description:
        "The tool automatically scans your text against platform restriction databases, highlighting high-risk words in the live preview with category tags.",
    },
    {
      step: "03",
      title: "Apply Safe Alternatives or One-Click Fix",
      description:
        "Click 'Fix Message' to automatically apply character spacing, or review the suggested platform-compliant phrasing for each flagged category.",
    },
    {
      step: "04",
      title: "Copy and Send with Confidence",
      description:
        "Click 'Copy Message' to copy your compliant text and paste it directly into your Fiverr inbox or Upwork proposal thread.",
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
              Fiverr & Upwork Word Checker
            </li>
          </ol>
        </nav>

        {/* Page Header / Intro */}
        <header className="mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Freelance Compliance Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Fiverr & Upwork Restricted Word Checker
          </h1>

          {/* <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            FastDev Restricted Word Checker scans your client messages, proposals, and gig descriptions against strict platform Terms of Service (TOS) guidelines. Avoid unexpected account warnings, shadowbans, and communication blocks by identifying high-risk keywords before sending. This essential utility helps freelancers—especially newcomers—phrase communications safely while staying completely within marketplace rules.
          </p> */}
        </header>

        {/* The Interactive Tool Component */}
        <section aria-label="Fiverr and Upwork Compliance Checker Tool" className="mb-16">
          <FiverrWordCheckerTool />
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
                How to Use the Word Checker
              </h2>
            </div>

            <div className="space-y-4">
              {howToSteps.map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold shrink-0 mt-0.5">
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
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h2
                id="why-matters-heading"
                className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                Why This Matters for Freelancers
              </h2>
            </div>

            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                Freelance marketplaces like Fiverr and Upwork employ aggressive automated bot filters that monitor chat logs and proposals 24/7. These systems flag terms related to direct contact, external payments, or review solicitations to prevent spam, fraud, and off-platform transactions (disintermediation).
              </p>
              <p>
                However, innocent conversations often trigger these algorithms by mistake. For example, discussing a voiceover for a client&apos;s &ldquo;voicemail greeting&rdquo; or asking a client to review a video link can trigger automated warning emails or temporary account restrictions.
              </p>
              <p>
                <strong>This tool does not encourage bypassing marketplace rules.</strong> Instead, it educates freelancers on how to phrase legitimate project discussions safely using compliant platform terminology, protecting your account reputation and hard-earned seller levels.
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Prevents automated TOS flags</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Protects seller level status</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Teaches compliant terminology</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>100% in-browser privacy</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Compliance Categories Reference Guide */}
        <section
          aria-labelledby="categories-guide-heading"
          className="mt-12 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/60 dark:bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <h2
              id="categories-guide-heading"
              className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
              Key Restricted Categories & Platform Guidelines
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <article className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 space-y-2">
              <strong className="block font-bold text-rose-600 dark:text-rose-400 text-sm">
                1. Direct Contact Methods
              </strong>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Keywords like <code className="font-mono text-[11px] bg-slate-200/70 dark:bg-slate-800 px-1 py-0.5 rounded">whatsapp</code>, <code className="font-mono text-[11px] bg-slate-200/70 dark:bg-slate-800 px-1 py-0.5 rounded">skype</code>, <code className="font-mono text-[11px] bg-slate-200/70 dark:bg-slate-800 px-1 py-0.5 rounded">email</code>, or phone numbers.
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-[11px]">
                <strong>Rule:</strong> Keep all discussions inside the official platform inbox unless an authorized Zoom integration is provided by the order page.
              </p>
            </article>

            <article className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 space-y-2">
              <strong className="block font-bold text-amber-600 dark:text-amber-400 text-sm">
                2. Off-Platform Payments
              </strong>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Keywords like <code className="font-mono text-[11px] bg-slate-200/70 dark:bg-slate-800 px-1 py-0.5 rounded">paypal</code>, <code className="font-mono text-[11px] bg-slate-200/70 dark:bg-slate-800 px-1 py-0.5 rounded">payoneer</code>, <code className="font-mono text-[11px] bg-slate-200/70 dark:bg-slate-800 px-1 py-0.5 rounded">bank account</code>, or <code className="font-mono text-[11px] bg-slate-200/70 dark:bg-slate-800 px-1 py-0.5 rounded">crypto</code>.
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-[11px]">
                <strong>Rule:</strong> Never transact or discuss payment processing outside platform escrow. Always use custom offers or milestone invoices.
              </p>
            </article>

            <article className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 space-y-2">
              <strong className="block font-bold text-blue-600 dark:text-blue-400 text-sm">
                3. Review & Rating Solicitation
              </strong>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Keywords like <code className="font-mono text-[11px] bg-slate-200/70 dark:bg-slate-800 px-1 py-0.5 rounded">five star</code>, <code className="font-mono text-[11px] bg-slate-200/70 dark:bg-slate-800 px-1 py-0.5 rounded">positive feedback</code>, or asking for tips.
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-[11px]">
                <strong>Rule:</strong> Never ask for specific star ratings or feedback manipulation. Ask if the buyer is satisfied with the deliverable instead.
              </p>
            </article>

            <article className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 space-y-2">
              <strong className="block font-bold text-purple-600 dark:text-purple-400 text-sm">
                4. Competing Marketplaces
              </strong>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Keywords referencing <code className="font-mono text-[11px] bg-slate-200/70 dark:bg-slate-800 px-1 py-0.5 rounded">upwork</code>, <code className="font-mono text-[11px] bg-slate-200/70 dark:bg-slate-800 px-1 py-0.5 rounded">peopleperhour</code>, or external links.
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-[11px]">
                <strong>Rule:</strong> Do not cross-reference competing platforms in client conversations.
              </p>
            </article>

            <article className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 space-y-2">
              <strong className="block font-bold text-orange-600 dark:text-orange-400 text-sm">
                5. Order Fulfillment & Conduct
              </strong>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Keywords like <code className="font-mono text-[11px] bg-slate-200/70 dark:bg-slate-800 px-1 py-0.5 rounded">empty delivery</code>, <code className="font-mono text-[11px] bg-slate-200/70 dark:bg-slate-800 px-1 py-0.5 rounded">free work</code>, or external dispute threats.
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-[11px]">
                <strong>Rule:</strong> Always deliver completed work files through official order channels and resolve issues via the Resolution Center.
              </p>
            </article>

            <article className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 space-y-2">
              <strong className="block font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                6. Safe Phrasing Best Practices
              </strong>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Use terms like <em className="text-slate-800 dark:text-slate-200">&ldquo;platform budget&rdquo;</em>, <em className="text-slate-800 dark:text-slate-200">&ldquo;custom offer&rdquo;</em>, <em className="text-slate-800 dark:text-slate-200">&ldquo;milestone delivery&rdquo;</em>, and <em className="text-slate-800 dark:text-slate-200">&ldquo;order inbox&rdquo;</em>.
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-[11px]">
                <strong>Tip:</strong> Clear, professional, and compliant messaging helps build long-term buyer trust.
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
