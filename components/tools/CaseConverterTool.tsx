"use client";

import React, { useState, useTransition } from "react";
import {
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ClipboardPaste,
  FileText,
  Hash,
  AlignLeft,
  ArrowRightLeft,
} from "lucide-react";

export function CaseConverterTool() {
  const [text, setText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [activeCase, setActiveCase] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Character and Word statistics
  const characterCount = text.length;
  const characterCountNoSpaces = text.replace(/\s/g, "").length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text ? text.split(/\r\n|\r|\n/).length : 0;

  // Primary Conversion Functions
  const toUppercase = (str: string) => str.toUpperCase();
  const toLowercase = (str: string) => str.toLowerCase();

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(/(\s+|[-_/])/)
      .map((part) => {
        if (!part || /^\s+$/.test(part) || /^[-_/]$/.test(part)) return part;
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join("");
  };

  const toSentenceCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/(^\s*|[.!?\n]\s*)([a-z\u00C0-\u024F])/g, (_, prefix, letter) => {
        return prefix + letter.toUpperCase();
      });
  };

  // Additional Developer Cases
  const toCamelCase = (str: string) => {
    const words = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || [];
    return words
      .map((word, i) => {
        const lower = word.toLowerCase();
        return i === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join("");
  };

  const toPascalCase = (str: string) => {
    const words = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || [];
    return words
      .map((word) => {
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join("");
  };

  const toSnakeCase = (str: string) => {
    const words = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || [];
    return words.map((w) => w.toLowerCase()).join("_");
  };

  const toKebabCase = (str: string) => {
    const words = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || [];
    return words.map((w) => w.toLowerCase()).join("-");
  };

  const toConstantCase = (str: string) => {
    const words = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || [];
    return words.map((w) => w.toUpperCase()).join("_");
  };

  const handleConvert = (type: string, converter: (s: string) => string) => {
    if (!text) return;
    startTransition(() => {
      setText(converter(text));
      setActiveCase(type);
    });
  };

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      setActiveCase(null);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  const handleClear = () => {
    setText("");
    setActiveCase(null);
  };

  const loadSampleText = () => {
    const sample =
      "feardev text case converter helps developers, freelancers, and content creators format strings with ease. it instantly transforms titles, code identifiers, and client messages into consistent letter casing!";
    setText(sample);
    setActiveCase(null);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Live Case Transformer
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadSampleText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Sample Text</span>
          </button>

          <button
            type="button"
            onClick={handlePaste}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>Paste</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={!text}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          {/* Divider */}
          <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 rounded-full" />

          {/* Copy to Clipboard — moved here for quick post-conversion access */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!text}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/35 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="p-5 sm:p-6">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setActiveCase(null);
            }}
            placeholder="Type or paste your text here to convert case instantly..."
            rows={9}
            className="w-full p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans text-base sm:text-lg leading-relaxed resize-y cursor-text"
          />
        </div>

        {/* Live Counters & Stats */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-indigo-500" />
              <strong className="font-semibold text-slate-700 dark:text-slate-200">{characterCount}</strong> Characters
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <strong className="font-semibold text-slate-700 dark:text-slate-200">{wordCount}</strong> Words
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-indigo-500" />
              <strong className="font-semibold text-slate-700 dark:text-slate-200">{lineCount}</strong> Lines
            </span>
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            {characterCountNoSpaces} chars without spaces
          </div>
        </div>

        {/* Primary Case Conversion Buttons */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Primary Formats
            </span>
            {activeCase && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Converted to {activeCase}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => handleConvert("UPPERCASE", toUppercase)}
              disabled={!text}
              className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-150 border cursor-pointer ${activeCase === "UPPERCASE"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25 ring-2 ring-indigo-500/20"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600/40 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                }`}
            >
              UPPERCASE
            </button>

            <button
              type="button"
              onClick={() => handleConvert("lowercase", toLowercase)}
              disabled={!text}
              className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-medium lowercase tracking-wide transition-all duration-150 border cursor-pointer ${activeCase === "lowercase"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25 ring-2 ring-indigo-500/20"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600/40 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                }`}
            >
              lowercase
            </button>

            <button
              type="button"
              onClick={() => handleConvert("Title Case", toTitleCase)}
              disabled={!text}
              className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 border cursor-pointer ${activeCase === "Title Case"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25 ring-2 ring-indigo-500/20"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600/40 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                }`}
            >
              Title Case
            </button>

            <button
              type="button"
              onClick={() => handleConvert("Sentence case", toSentenceCase)}
              disabled={!text}
              className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 border cursor-pointer ${activeCase === "Sentence case"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25 ring-2 ring-indigo-500/20"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600/40 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                }`}
            >
              Sentence case
            </button>
          </div>

          {/* Developer Specific Cases */}
          <div className="pt-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
              Code & Variable Formats
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => handleConvert("camelCase", toCamelCase)}
                disabled={!text}
                className={`px-3 py-2 rounded-lg text-xs font-mono transition-all border cursor-pointer ${activeCase === "camelCase"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                  }`}
              >
                camelCase
              </button>

              <button
                type="button"
                onClick={() => handleConvert("PascalCase", toPascalCase)}
                disabled={!text}
                className={`px-3 py-2 rounded-lg text-xs font-mono transition-all border cursor-pointer ${activeCase === "PascalCase"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                  }`}
              >
                PascalCase
              </button>

              <button
                type="button"
                onClick={() => handleConvert("snake_case", toSnakeCase)}
                disabled={!text}
                className={`px-3 py-2 rounded-lg text-xs font-mono transition-all border cursor-pointer ${activeCase === "snake_case"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                  }`}
              >
                snake_case
              </button>

              <button
                type="button"
                onClick={() => handleConvert("kebab-case", toKebabCase)}
                disabled={!text}
                className={`px-3 py-2 rounded-lg text-xs font-mono transition-all border cursor-pointer ${activeCase === "kebab-case"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                  }`}
              >
                kebab-case
              </button>

              <button
                type="button"
                onClick={() => handleConvert("CONSTANT_CASE", toConstantCase)}
                disabled={!text}
                className={`col-span-2 sm:col-span-1 px-3 py-2 rounded-lg text-xs font-mono transition-all border cursor-pointer ${activeCase === "CONSTANT_CASE"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                  }`}
              >
                CONSTANT_CASE
              </button>
            </div>
          </div>
        </div>

        {/* Privacy notice */}
        <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Client-side transformation • No data leaves your machine
          </p>
        </div>
      </div>
    </div>
  );
}
