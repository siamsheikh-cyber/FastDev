"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  UploadCloud,
  FileScan,
  Image as ImageIcon,
  Copy,
  Check,
  RotateCcw,
  Download,
  AlertCircle,
  Loader2,
  Sparkles,
  FileText,
  CheckCircle2,
  X,
} from "lucide-react";

interface ImageInfo {
  name: string;
  size: string;
  type: string;
  previewUrl: string;
}

export function ImageToTextTool() {
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height to fit content without internal scrollbars
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [extractedText]);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Perform OCR extraction using lazy-loaded Tesseract.js
  const processImageOCR = useCallback(async (imageSrc: string) => {
    setIsProcessing(true);
    setProgress(0);
    setStatusText("Initializing OCR Engine...");
    setErrorMessage(null);

    try {
      // Lazy load Tesseract.js only when OCR is triggered
      const Tesseract = await import("tesseract.js");

      const result = await Tesseract.recognize(imageSrc, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            const p = Math.round((m.progress || 0) * 100);
            setProgress(p);
            setStatusText(`Recognizing text... (${p}%)`);
          } else if (m.status === "loading tesseract core") {
            setStatusText("Loading core OCR module...");
          } else if (m.status === "initializing tesseract") {
            setStatusText("Initializing Tesseract engine...");
          } else if (m.status === "loading language traineddata") {
            setStatusText("Loading English language dataset...");
          } else if (m.status === "initializing api") {
            setStatusText("Preparing OCR API...");
          } else {
            setStatusText(m.status ? `${m.status}...` : "Processing image...");
          }
        },
      });

      const text = result?.data?.text || "";
      if (!text.trim()) {
        setExtractedText("");
        setErrorMessage(
          "No readable text was detected in the image. Please ensure the image contains clear, sharp text or code."
        );
      } else {
        setExtractedText(text.trim());
      }
    } catch (err: unknown) {
      console.error("OCR Error:", err);
      setErrorMessage(
        "Failed to extract text from the image. Please try another image with better lighting and contrast."
      );
    } finally {
      setIsProcessing(false);
      setProgress(100);
      setStatusText("");
    }
  }, []);

  // Handle incoming file selection (from input or drop)
  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage(
        "Invalid file format. Please upload an image file (PNG, JPG, JPEG, WEBP, BMP, or GIF)."
      );
      return;
    }

    setErrorMessage(null);
    setExtractedText("");

    const previewUrl = URL.createObjectURL(file);
    setSelectedImage({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type.split("/")[1]?.toUpperCase() || "IMAGE",
      previewUrl,
    });

    processImageOCR(previewUrl);
  };

  // Drag & Drop event handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // File input change handler
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  // Clear / Reset
  const handleClear = () => {
    if (selectedImage?.previewUrl) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }
    setSelectedImage(null);
    setExtractedText("");
    setErrorMessage(null);
    setIsProcessing(false);
    setProgress(0);
    setStatusText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  // Download text file
  const handleDownload = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `feardev-ocr-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Sample image demo generator for instant testing
  const handleLoadSample = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text content
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 24px monospace";
    ctx.fillText("// FearDev OCR Test Code", 30, 50);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "18px monospace";
    ctx.fillText("function calculateVelocity(distance, time) {", 30, 95);
    ctx.fillText("  if (time <= 0) return 0;", 30, 130);
    ctx.fillText("  return (distance / time).toFixed(2);", 30, 165);
    ctx.fillText("}", 30, 200);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "italic 16px sans-serif";
    ctx.fillText("FearDev Instant In-Browser OCR Extraction", 30, 250);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "sample-code-screenshot.png", {
          type: "image/png",
        });
        handleFile(file);
      }
    });
  };

  const wordCount = extractedText.trim()
    ? extractedText.trim().split(/\s+/).length
    : 0;
  const charCount = extractedText.length;
  const lineCount = extractedText.trim()
    ? extractedText.split(/\r\n|\r|\n/).length
    : 0;

  return (
    <div className="w-full space-y-8">
      {/* Main Tool Container */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <FileScan className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              In-Browser Optical Character Recognition (OCR)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              id="load-sample-image-btn"
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Load Sample Image</span>
            </button>

            {(selectedImage || extractedText) && (
              <button
                type="button"
                onClick={handleClear}
                id="clear-ocr-btn"
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear / Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mx-5 sm:mx-6 mt-5 p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm leading-relaxed">
              <p className="font-semibold mb-0.5">Recognition Notice</p>
              <p>{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload & Workspace Grid */}
        <div className="p-5 sm:p-6 space-y-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
            id="ocr-file-picker"
          />

          {!selectedImage ? (
            /* Drag and Drop Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center group ${isDragOver
                  ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-4 ring-indigo-500/20 scale-[0.99]"
                  : "border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40 hover:border-indigo-400 dark:hover:border-indigo-500/60 hover:bg-slate-100/60 dark:hover:bg-slate-900/60"
                }`}
            >
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-200 ${isDragOver
                    ? "bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-600/30"
                    : "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white"
                  }`}
              >
                <UploadCloud className="w-8 h-8" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                Drop your image here or{" "}
                <span className="text-indigo-600 dark:text-indigo-400 underline underline-offset-4 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                  browse files
                </span>
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed mb-4">
                Supports PNG, JPG, JPEG, WEBP, BMP, and GIF screenshots, scans, or document photos.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  100% Client-Side
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  Zero Server Uploads
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  No File Size Limit
                </span>
              </div>
            </div>
          ) : (
            /* Selected Image & Processing Status Section */
            <div className="space-y-6">
              {/* Image Preview Card */}
              <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-700 shrink-0 shadow-sm flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedImage.previewUrl}
                        alt="OCR preview source"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                          {selectedImage.type}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {selectedImage.size}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate">
                        {selectedImage.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {isProcessing
                          ? "Running neural character recognition..."
                          : "Image loaded and ready for text processing"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                      <span>New Image</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => processImageOCR(selectedImage.previewUrl)}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs shadow-indigo-600/20"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Scanning...</span>
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Re-Scan Image</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Progress Bar during OCR execution */}
                {isProcessing && (
                  <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        {statusText || "Processing OCR..."}
                      </span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-400 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Extracted Text Section */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label
                    htmlFor="ocr-extracted-text-area"
                    className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Extracted Text Result</span>
                  </label>

                  {/* Counters */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span>
                      <strong className="text-slate-900 dark:text-slate-100 font-semibold font-mono">
                        {charCount}
                      </strong>{" "}
                      characters
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-slate-900 dark:text-slate-100 font-semibold font-mono">
                        {wordCount}
                      </strong>{" "}
                      words
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-slate-900 dark:text-slate-100 font-semibold font-mono">
                        {lineCount}
                      </strong>{" "}
                      lines
                    </span>
                  </div>
                </div>

                {/* Auto-resizing Textarea */}
                <textarea
                  ref={textareaRef}
                  id="ocr-extracted-text-area"
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder={
                    isProcessing
                      ? "Extracting text with Tesseract.js engine, please wait a moment..."
                      : "Extracted text will appear here. You can also edit or refine the text directly in this box."
                  }
                  rows={7}
                  className="w-full p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-[border-color,box-shadow,background-color] font-sans text-base leading-relaxed resize-none overflow-hidden min-h-[180px]"
                />

                {/* Action Bar for Extracted Text */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleCopy}
                      id="copy-extracted-text-btn"
                      disabled={!extractedText || isProcessing}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-300" />
                          <span>Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Extracted Text</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleDownload}
                      id="download-extracted-text-btn"
                      disabled={!extractedText || isProcessing}
                      className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span>Download .TXT</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Editable & auto-resizing text area</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
