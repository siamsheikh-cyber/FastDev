import React from "react";
import Link from "next/link";
import { Terminal, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600 text-white shadow-sm">
                <Terminal className="w-4 h-4" />
              </div>
              <span>FastDev</span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
              An all-in-one developer and freelancer utility toolkit built for fast, secure, client-side productivity. No sign-ups required.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Toolbox
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/tools/case-converter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-slate-900 dark:text-slate-200">
                  Text Case Converter
                </Link>
              </li>
              <li>
                <Link href="/#tools" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Image to Text (OCR)
                </Link>
              </li>
              <li>
                <Link href="/#tools" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Fiverr / Upwork Word Checker
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform / Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/sitemap.xml" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Sitemap
                </Link>
              </li>
              <li>
                <Link href="/robots.txt" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Robots.txt
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  All Systems Operational
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {currentYear} FastDev. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for developers & freelancers.
          </p>
        </div>
      </div>
    </footer>
  );
}
