"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import restrictedWordsData from "@/data/restricted-words.json";
import {
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Sparkles,
  ClipboardPaste,
  RotateCcw,
  Copy,
  Check,
  Wand2,
  AlertTriangle,
  Info,
  CheckCircle2,
  Layers,
  ArrowRight,
  Search,
  ExternalLink,
  MessageSquareWarning,
  Eye,
  FileText,
  HelpCircle,
  Zap,
} from "lucide-react";

export interface RestrictedWordItem {
  word: string;
  category: string;
  alternative: string;
  note?: string;
}

export interface DetectedIssue {
  id: string;
  matchedText: string;
  canonicalWord: string;
  category: string;
  alternative: string;
  note?: string;
  startIndex: number;
  endIndex: number;
  isObfuscated: boolean;
}

interface Segment {
  text: string;
  isMatch: boolean;
  issue?: DetectedIssue;
}

// Helper to escape regex special characters
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Generate matching regex for a word/phrase that also matches the obfuscated format (e.g. "p_ayment" or "payment")
function buildWordRegex(word: string): RegExp {
  const parts = word.trim().split(/\s+/);
  if (parts.length === 0) return new RegExp("$^");

  const firstPart = parts[0];
  let firstPattern = escapeRegExp(firstPart);

  // If first word has at least 2 characters and doesn't already contain underscore
  if (firstPart.length >= 2 && !firstPart.includes("_")) {
    const char0 = escapeRegExp(firstPart[0]);
    const rest = escapeRegExp(firstPart.slice(1));
    firstPattern = `${char0}_?${rest}`;
  }

  const otherPatterns = parts.slice(1).map((p) => escapeRegExp(p));
  const fullPattern = [firstPattern, ...otherPatterns].join("\\s+");

  // Use word boundaries or start/end of string / punctuation boundaries
  return new RegExp(`(^|[^a-zA-Z0-9_])(${fullPattern})(?=[^a-zA-Z0-9_]|$)`, "gi");
}

// Function to fix a detected word/phrase by placing '_' between 1st and 2nd char of the 1st word
function applyUnderscoreFix(matchedText: string): string {
  // If already contains an underscore near start, don't duplicate
  if (matchedText.length >= 2 && matchedText[1] === "_") {
    return matchedText;
  }

  const parts = matchedText.split(/(\s+)/);
  if (parts.length === 0) return matchedText;

  // Find the first word token
  const firstWordIndex = parts.findIndex((p) => !/^\s+$/.test(p));
  if (firstWordIndex === -1) return matchedText;

  const firstWord = parts[firstWordIndex];
  if (firstWord.length < 2) return matchedText;

  // Insert underscore between 1st and 2nd char
  const fixedFirstWord = firstWord[0] + "_" + firstWord.slice(1);
  parts[firstWordIndex] = fixedFirstWord;
  return parts.join("");
}

const SAMPLE_TEXT = `Hi there! I can complete your web design project within 2 days. 
Please contact me directly on whatsapp or skype at my personal phone number so we can discuss details outside of fiverr. 
For payment, I prefer paypal or direct wire transfer to my bank account.
Once delivered, please make sure to leave a five star positive feedback review!`;

export function FiverrWordCheckerTool() {
  const [inputText, setInputText] = useState<string>("");
  const [debouncedText, setDebouncedText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedAltId, setCopiedAltId] = useState<string | null>(null);
  const [fixAppliedMessage, setFixAppliedMessage] = useState<string | null>(null);
  const [hoveredIssueId, setHoveredIssueId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | string>("all");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height to fit content without internal scrollbars
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  // Sorted list of restricted words (longest first to prioritize multi-word matches)
  const sortedDictionary: RestrictedWordItem[] = useMemo(() => {
    return [...(restrictedWordsData as RestrictedWordItem[])].sort(
      (a, b) => b.word.length - a.word.length
    );
  }, []);

  // Debounce input to avoid sluggish typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(inputText);
    }, 180);
    return () => clearTimeout(timer);
  }, [inputText]);

  // Scan text and detect all restricted words
  const scanText = useCallback(
    (textToScan: string): { issues: DetectedIssue[]; segments: Segment[] } => {
      if (!textToScan.trim()) {
        return { issues: [], segments: [{ text: textToScan, isMatch: false }] };
      }

      const issues: DetectedIssue[] = [];
      const matchIntervals: {
        start: number;
        end: number;
        issue: DetectedIssue;
      }[] = [];

      for (const item of sortedDictionary) {
        const regex = buildWordRegex(item.word);
        let match: RegExpExecArray | null;

        while ((match = regex.exec(textToScan)) !== null) {
          const prefix = match[1] || "";
          const matchedText = match[2];
          const startIndex = match.index + prefix.length;
          const endIndex = startIndex + matchedText.length;

          // Check if this interval overlaps with any existing match
          const hasOverlap = matchIntervals.some(
            (interval) =>
              (startIndex >= interval.start && startIndex < interval.end) ||
              (endIndex > interval.start && endIndex <= interval.end) ||
              (startIndex <= interval.start && endIndex >= interval.end)
          );

          if (!hasOverlap) {
            const isObfuscated =
              matchedText.length >= 2 && matchedText[1] === "_";
            const issue: DetectedIssue = {
              id: `${startIndex}-${endIndex}-${item.word}`,
              matchedText,
              canonicalWord: item.word,
              category: item.category,
              alternative: item.alternative,
              note: item.note,
              startIndex,
              endIndex,
              isObfuscated,
            };

            issues.push(issue);
            matchIntervals.push({ start: startIndex, end: endIndex, issue });
          }
        }
      }

      // Sort matches by start index
      matchIntervals.sort((a, b) => a.start - b.start);

      // Build highlighted segments
      const segments: Segment[] = [];
      let cursor = 0;

      for (const interval of matchIntervals) {
        if (interval.start > cursor) {
          segments.push({
            text: textToScan.slice(cursor, interval.start),
            isMatch: false,
          });
        }
        segments.push({
          text: textToScan.slice(interval.start, interval.end),
          isMatch: true,
          issue: interval.issue,
        });
        cursor = interval.end;
      }

      if (cursor < textToScan.length) {
        segments.push({
          text: textToScan.slice(cursor),
          isMatch: false,
        });
      }

      return { issues, segments };
    },
    [sortedDictionary]
  );

  const { issues: detectedIssues, segments: previewSegments } = useMemo(
    () => scanText(inputText),
    [inputText, scanText]
  );

  // Group issues by Category
  const groupedIssues = useMemo(() => {
    const groups: Record<string, DetectedIssue[]> = {};
    for (const issue of detectedIssues) {
      if (!groups[issue.category]) {
        groups[issue.category] = [];
      }
      groups[issue.category].push(issue);
    }
    return groups;
  }, [detectedIssues]);

  const categoriesList = useMemo(() => {
    return Object.keys(groupedIssues);
  }, [groupedIssues]);

  // Statistics
  const charCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const issueCount = detectedIssues.length;
  const obfuscatedCount = detectedIssues.filter((i) => i.isObfuscated).length;
  const unfixedCount = issueCount - obfuscatedCount;

  // Calculate Risk Level
  const riskLevel = useMemo(() => {
    if (!inputText.trim() || issueCount === 0) return "Safe";
    if (unfixedCount === 0 && obfuscatedCount > 0) return "Caution (Obfuscated)";
    if (unfixedCount <= 2) return "Medium Risk";
    return "High Risk";
  }, [inputText, issueCount, unfixedCount, obfuscatedCount]);

  // Manual trigger / Refresh check
  const handleCheckMessage = () => {
    setDebouncedText(inputText);
  };

  // Fix button implementation
  const handleFix = () => {
    if (!inputText.trim()) return;

    const { issues } = scanText(inputText);
    if (issues.length === 0) {
      setFixAppliedMessage("No restricted words found to fix.");
      setTimeout(() => setFixAppliedMessage(null), 3000);
      return;
    }

    // Sort issues descending by start position to safely replace in string
    const sortedIssues = [...issues].sort((a, b) => b.startIndex - a.startIndex);
    let newText = inputText;
    let fixedWordsCount = 0;

    for (const issue of sortedIssues) {
      if (!issue.isObfuscated) {
        const fixedWord = applyUnderscoreFix(issue.matchedText);
        if (fixedWord !== issue.matchedText) {
          newText =
            newText.slice(0, issue.startIndex) +
            fixedWord +
            newText.slice(issue.endIndex);
          fixedWordsCount++;
        }
      }
    }

    setInputText(newText);
    setDebouncedText(newText);
    setFixAppliedMessage(
      fixedWordsCount > 0
        ? `Fixed ${fixedWordsCount} restricted word${fixedWordsCount > 1 ? "s" : ""} with platform-safe character spacing.`
        : "All detected restricted words are already formatted."
    );
    setTimeout(() => setFixAppliedMessage(null), 4000);
  };

  // Replace a specific issue with its suggested alternative
  const handleReplaceWithAlternative = (issue: DetectedIssue) => {
    // If alternative is an instruction note, copy instead or replace cleanly
    const isRemoveNote = issue.alternative.toLowerCase().startsWith("remove");
    const replacement = isRemoveNote ? "" : issue.alternative;

    let newText =
      inputText.slice(0, issue.startIndex) +
      replacement +
      inputText.slice(issue.endIndex);

    // Clean double spaces if removed
    if (isRemoveNote) {
      newText = newText.replace(/\s{2,}/g, " ");
    }

    setInputText(newText);
    setDebouncedText(newText);
  };

  const handleCopy = async () => {
    if (!inputText) return;
    try {
      await navigator.clipboard.writeText(inputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleCopyAlternative = async (textToCopy: string, id: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedAltId(id);
      setTimeout(() => setCopiedAltId(null), 2000);
    } catch (err) {
      console.error("Failed to copy alternative:", err);
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setInputText(clipboardText);
      setDebouncedText(clipboardText);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  const handleClear = () => {
    setInputText("");
    setDebouncedText("");
    setFixAppliedMessage(null);
  };

  const loadSample = () => {
    setInputText(SAMPLE_TEXT);
    setDebouncedText(SAMPLE_TEXT);
    setFixAppliedMessage(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Contact/Communication Methods":
        return "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/60";
      case "Payment Related":
        return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60";
      case "Other Marketplace Related":
        return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/60";
      case "Reviews/Rating Related":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/60";
      case "Conduct Related":
        return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800/60";
      default:
        return "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800";
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Main Tool Card */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Freelance Message Compliance Scanner
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={loadSample}
              id="load-sample-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Load Sample</span>
            </button>

            <button
              type="button"
              onClick={handlePaste}
              id="paste-message-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>Paste</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              id="clear-message-btn"
              disabled={!inputText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Text Input Section */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="freelance-message-input"
                className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                <span>Original Message / Proposal Draft</span>
              </label>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Type or paste client message below
              </span>
            </div>

            <textarea
              ref={textareaRef}
              id="freelance-message-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your Fiverr inbox reply, Upwork proposal, or buyer message here to check for restricted keywords..."
              rows={6}
              className="w-full p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-[border-color,box-shadow,background-color] font-sans text-base leading-relaxed resize-none overflow-hidden min-h-[160px] cursor-text"
            />
          </div>

          {/* Action Row: Check Button + Fix Button + Metrics */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* <button
                type="button"
                onClick={handleCheckMessage}
                id="check-message-btn"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 active:scale-[0.99] transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Check Message</span>
              </button>*/}

              <button
                type="button"
                onClick={handleFix}
                id="fix-message-btn"
                disabled={!inputText.trim()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <Wand2 className="w-4 h-4 text-indigo-200" />
                <span>Fix Message (Auto-Spacing)</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span>
                <strong className="font-semibold text-slate-700 dark:text-slate-200">
                  {charCount}
                </strong>{" "}
                Characters
              </span>
              <span>
                <strong className="font-semibold text-slate-700 dark:text-slate-200">
                  {wordCount}
                </strong>{" "}
                Words
              </span>
              <span
                className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full border text-xs ${issueCount === 0
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60"
                  : unfixedCount === 0
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800/60"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800/60 animate-pulse"
                  }`}
              >
                {issueCount === 0 ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                <span>
                  {issueCount === 0
                    ? "0 Issues Detected"
                    : `${issueCount} Flagged Word${issueCount > 1 ? "s" : ""}`}
                </span>
              </span>
            </div>
          </div>

          {/* Feedback banner if fix was applied */}
          {fixAppliedMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-800 dark:text-indigo-300 animate-in fade-in slide-in-from-top-1 duration-200">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="font-medium">{fixAppliedMessage}</span>
            </div>
          )}

          {/* Rendered Live Preview with Highlighted Words */}
          <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Compliance Visual Preview & Word Highlights
                </h3>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-rose-500/20 border border-rose-400" />
                <span>Flagged Term</span>
              </div>
            </div>

            <div
              id="compliance-preview-box"
              className="w-full min-h-[120px] p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/80 text-slate-800 dark:text-slate-200 font-sans text-base leading-relaxed whitespace-pre-wrap select-text transition-colors"
            >
              {inputText.trim() ? (
                previewSegments.map((segment, index) => {
                  if (!segment.isMatch || !segment.issue) {
                    return <span key={index}>{segment.text}</span>;
                  }

                  const issue = segment.issue;
                  const isHovered = hoveredIssueId === issue.id;

                  return (
                    <span
                      key={index}
                      onMouseEnter={() => setHoveredIssueId(issue.id)}
                      onMouseLeave={() => setHoveredIssueId(null)}
                      className={`relative inline-block px-1.5 py-0.5 mx-0.5 rounded-md font-medium text-sm transition-all duration-150 cursor-pointer ${issue.isObfuscated
                        ? "bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-400/80 dark:border-amber-600/80"
                        : "bg-rose-500/20 text-rose-900 dark:text-rose-200 border border-rose-400/80 dark:border-rose-600/80"
                        } ${isHovered
                          ? "ring-2 ring-indigo-500 scale-105 z-20 shadow-md"
                          : ""
                        }`}
                      title={`${issue.canonicalWord} (${issue.category}) - ${issue.alternative}`}
                    >
                      <span>{segment.text}</span>

                      {/* Micro badge indicator */}
                      <span className="text-[10px] ml-1 opacity-75 font-mono">
                        [{issue.isObfuscated ? "fixed" : "flagged"}]
                      </span>
                    </span>
                  );
                })
              ) : (
                <span className="text-slate-400 dark:text-slate-600 italic">
                  Preview with live highlighted keywords will render here as you type or paste your message...
                </span>
              )}
            </div>
          </div>

          {/* Copy safe/modified message action */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                100% private client-side checking. Messages are never transmitted to external servers.
              </span>
            </div>

            <div className="w-full sm:w-auto flex items-center justify-end gap-2.5">
              {copied && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 animate-fade-in">
                  <Check className="w-3.5 h-3.5" />
                  Copied message!
                </span>
              )}

              <button
                type="button"
                onClick={handleCopy}
                id="copy-message-btn"
                disabled={!inputText.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Message</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Flagged Words & Suggested Alternatives Section */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm transition-all space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                <MessageSquareWarning className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Detected Violations & Recommended Safe Alternatives
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Review flagged terms grouped by platform compliance category and apply recommended substitutions.
            </p>
          </div>

          {/* Safety Rating Badge */}
          <div className="shrink-0">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold ${riskLevel === "Safe"
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                : riskLevel.includes("Caution")
                  ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                  : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                }`}
            >
              {riskLevel === "Safe" ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : riskLevel.includes("Caution") ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <ShieldX className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              )}
              <span>Status: {riskLevel}</span>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        {categoriesList.length > 1 && (
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${activeTab === "all"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
            >
              All Categories ({detectedIssues.length})
            </button>
            {categoriesList.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${activeTab === cat
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
              >
                {cat} ({groupedIssues[cat].length})
              </button>
            ))}
          </div>
        )}

        {/* List of Detected Issues */}
        {detectedIssues.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedIssues).map(([category, items]) => {
              if (activeTab !== "all" && activeTab !== category) return null;

              return (
                <div
                  key={category}
                  className="rounded-xl border border-slate-200 dark:border-slate-800/90 bg-slate-50/50 dark:bg-slate-950/40 p-4 sm:p-5 space-y-3.5"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getCategoryColor(
                          category
                        )}`}
                      >
                        {category}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {items.length} {items.length === 1 ? "match" : "matches"}
                      </span>
                    </div>
                  </div>

                  {/* Issues inside category */}
                  <div className="grid grid-cols-1 gap-3">
                    {items.map((issue) => {
                      const isHovered = hoveredIssueId === issue.id;
                      const isCopiedAlt = copiedAltId === issue.id;

                      return (
                        <div
                          key={issue.id}
                          onMouseEnter={() => setHoveredIssueId(issue.id)}
                          onMouseLeave={() => setHoveredIssueId(null)}
                          className={`flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-xl border bg-white dark:bg-slate-900 transition-all ${isHovered
                            ? "border-indigo-400 dark:border-indigo-600 shadow-md ring-1 ring-indigo-500/20"
                            : "border-slate-200/90 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700"
                            }`}
                        >
                          {/* Left: Matched word + Note */}
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800/60">
                                &quot;{issue.matchedText}&quot;
                              </span>

                              {issue.isObfuscated && (
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                                  Formatted with underscore
                                </span>
                              )}

                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                (Trigger: {issue.canonicalWord})
                              </span>
                            </div>

                            {issue.note && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                <span>{issue.note}</span>
                              </p>
                            )}
                          </div>

                          {/* Right: Suggested Alternative + Action Buttons */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 shrink-0 md:max-w-md">
                            <div className="p-2 sm:px-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 text-xs">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                                Recommended Alternative:
                              </span>
                              <span className="font-medium text-slate-800 dark:text-slate-200">
                                {issue.alternative}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopyAlternative(issue.alternative, issue.id)
                                }
                                title="Copy alternative phrase to clipboard"
                                className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              >
                                {isCopiedAlt ? (
                                  <Check className="w-4 h-4 text-emerald-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleReplaceWithAlternative(issue)}
                                title="Apply this substitution into message"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/80 transition-colors cursor-pointer"
                              >
                                <span>Apply</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {inputText.trim()
                ? "No Restricted Words Detected!"
                : "No Message Entered Yet"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {inputText.trim()
                ? "Your message looks compliant with standard marketplace communication policies."
                : "Type or paste your proposal or client reply above, or click 'Load Sample' to see how flagged words and suggestions appear."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
