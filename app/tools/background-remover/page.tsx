import type { Metadata } from "next";
import Link from "next/link";
import { BackgroundRemoverTool } from "@/components/tools/BackgroundRemoverTool";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Image as ImageIcon,
  CheckCircle2,
  Lock,
  Layers,
  HelpCircle,
  ArrowRight,
  UserCheck,
  ShoppingBag,
  Palette,
  Camera,
} from "lucide-react";

const pageUrl = "https://feardev.vercel.app/tools/background-remover";

export const metadata: Metadata = {
  title: "Free Image Background Remover Online – No Upload",
  description:
    "Remove image backgrounds automatically in your browser with on-device AI. Free, instant transparent PNG cutouts for product photos, headshots, and mockups.",
  keywords: [
    "image background remover",
    "free background remover online",
    "remove background from image",
    "transparent png generator",
    "in browser background removal",
    "client side background removal",
    "product photo cutout",
    "profile picture transparent background",
    "feardev tools",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Free Image Background Remover Online – No Upload | FearDev",
    description:
      "Instantly isolate subjects and generate transparent PNG cutouts in your browser. 100% private, on-device AI processing.",
    url: pageUrl,
    type: "website",
    siteName: "FearDev",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FearDev Image Background Remover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image Background Remover Online – No Upload | FearDev",
    description:
      "Zero server uploads. Remove image backgrounds locally with WebAssembly neural networks.",
    images: ["/og-image.png"],
  },
};

export default function BackgroundRemoverPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Image Background Remover",
    url: pageUrl,
    description:
      "A free, client-side tool to remove image backgrounds automatically and download high-resolution transparent PNG cutouts without server uploads.",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Client-side WebAssembly AI segmentation model",
      "Instant transparent background PNG generation",
      "Interactive Before & After side-by-side preview",
      "Direct clipboard copy of transparent image",
      "Zero server uploads ensuring 100% image confidentiality",
      "No account signup or usage subscriptions required",
    ],
  };

  const howToSteps = [
    {
      step: "01",
      title: "Upload or Drop Your Image",
      description:
        "Drag and drop any portrait, product photo, or graphic (JPG, PNG, or WEBP) into the upload box, or click to browse files from your computer or phone.",
    },
    {
      step: "02",
      title: "Automatic On-Device AI Processing",
      description:
        "The neural network runs directly inside your browser via WebAssembly to detect foreground edges, hair strands, and contours with high precision.",
    },
    {
      step: "03",
      title: "Preview Against Checkerboard Pattern",
      description:
        "Inspect your transparent cutout side-by-side with the original photo against a standard alpha checkerboard backdrop.",
    },
    {
      step: "04",
      title: "Download or Copy Transparent PNG",
      description:
        "Click Download Cutout PNG to save your clean cutout image instantly, or copy the transparent image directly to your clipboard.",
    },
  ];

  const useCases = [
    {
      icon: ShoppingBag,
      title: "E-Commerce & Product Shots",
      description:
        "Isolate marketplace merchandise for Amazon, Shopify, Etsy, and eBay listings on pure white or transparent backdrops.",
    },
    {
      icon: UserCheck,
      title: "Profile Pictures & Headshots",
      description:
        "Create polished, professional profile pictures, resume headshots, and avatar badges for LinkedIn, GitHub, and Twitter.",
    },
    {
      icon: Palette,
      title: "Graphic Design & App Mockups",
      description:
        "Cut out icons, illustrations, and subject layers to composite into Figma wireframes, presentation decks, and banners.",
    },
  ];

  const faqs = [
    {
      q: "Are my photos uploaded to an external server?",
      a: "No. FearDev uses on-device WebAssembly machine learning. The neural model executes 100% inside your browser session, meaning your personal or confidential photos never leave your device.",
    },
    {
      q: "What image formats and file sizes are supported?",
      a: "You can upload JPG, PNG, and WEBP images up to 25MB. The output is always delivered as a lossless transparent PNG file.",
    },
    {
      q: "Why is the first run slightly slower than subsequent runs?",
      a: "On your first use, your browser downloads the lightweight neural model into local cache. Subsequent removals during your session process much faster with zero re-downloading.",
    },
    {
      q: "Is there any daily limit or watermark added?",
      a: "No. FearDev Image Background Remover is completely free with no watermarks, no account registration, and no daily usage caps.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Breadcrumbs Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Image Tools</span>
            <span>/</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold" aria-current="page">
              Image Background Remover
            </span>
          </nav>

          {/* Page Header */}
          <header className="space-y-4 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>On-Device Neural Segmentation</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Image Background Remover
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Remove image backgrounds automatically in seconds using client-side AI. Perfect for developers, freelancers, and designers who need crisp product photos, avatars, and clean design cutouts without uploading files to remote servers.
            </p>
          </header>

          {/* Interactive Tool Container */}
          <section aria-label="Image Background Remover Tool" className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/70 dark:bg-slate-900/70 p-4 sm:p-6 lg:p-8 backdrop-blur-xl shadow-xl shadow-slate-900/5 dark:shadow-2xl dark:shadow-black/40">
            <BackgroundRemoverTool />
          </section>

          {/* How To Use Section */}
          <section className="space-y-6 pt-4">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                How to Remove Backgrounds in 4 Simple Steps
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No complex editing tools or Photoshop skills required.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {howToSteps.map((stepItem) => (
                <article
                  key={stepItem.step}
                  className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 shadow-xs space-y-3"
                >
                  <span className="inline-block text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                    STEP {stepItem.step}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {stepItem.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {stepItem.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Why This Matters & Use Cases Section */}
          <section className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Why On-Device Background Removal Matters
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Fast, private, and dependable asset creation for your daily workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {useCases.map((uc) => {
                const Icon = uc.icon;
                return (
                  <article
                    key={uc.title}
                    className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 shadow-xs space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                      {uc.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {uc.description}
                    </p>
                  </article>
                );
              })}
            </div>

            {/* Privacy Guarantee Banner */}
            <div className="p-6 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/70 bg-emerald-50/60 dark:bg-emerald-950/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-emerald-100">
                  100% In-Browser Privacy — Zero Server Uploads
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-300/80 leading-relaxed">
                  Unlike traditional cloud background removal services that send your sensitive images to third-party servers, FearDev executes the neural segmentation network locally on your device via WebAssembly. Your photos remain 100% private and confidential.
                </p>
              </div>
            </div>
          </section>

          {/* Frequently Asked Questions */}
          <section className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Everything you need to know about FearDev Image Background Remover.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map((faq) => (
                <article
                  key={faq.q}
                  className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 space-y-2 shadow-xs"
                >
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                    {faq.a}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Related Tools Footer Link Banner */}
          <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Explore More Image Utilities
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Convert formats between JPG, PNG & WEBP, or extract text from screenshots using OCR.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/tools/image-format-converter"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <span>Format Converter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/tools/image-to-text"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors"
              >
                <span>Image OCR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
