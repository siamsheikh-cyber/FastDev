"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  UploadCloud,
  Eraser,
  Sparkles,
  Download,
  RotateCcw,
  AlertCircle,
  Loader2,
  CheckCircle2,
  X,
  FileImage,
  Copy,
  Check,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface ImageInfo {
  name: string;
  size: string;
  type: string;
  previewUrl: string;
  rawFile: File;
}

export function BackgroundRemoverTool() {
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format file size helper
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Perform background removal using @imgly/background-removal (lazy loaded)
  const processBackgroundRemoval = useCallback(async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setStatusText("Initializing AI model...");
    setErrorMessage(null);
    setResultImageUrl(null);
    setResultBlob(null);

    try {
      // Lazy load @imgly/background-removal only on demand
      const { removeBackground } = await import("@imgly/background-removal");

      const blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          const percent = total > 0 ? Math.round((current / total) * 100) : 0;
          setProgress(percent);

          if (key.includes("fetch")) {
            setStatusText(
              percent > 0
                ? `Loading AI Model (${percent}%)...`
                : "Downloading on-device neural model..."
            );
          } else if (key.includes("compute") || key.includes("inference")) {
            setStatusText(
              percent > 0
                ? `Removing background (${percent}%)...`
                : "Segmenting foreground subject..."
            );
          } else {
            setStatusText(
              percent > 0
                ? `Processing image (${percent}%)...`
                : "Refining cutout edges..."
            );
          }
        },
      });

      const objectUrl = URL.createObjectURL(blob);
      setResultImageUrl(objectUrl);
      setResultBlob(blob);
      setStatusText("Background removed successfully!");
    } catch (err: unknown) {
      console.error("Background removal error:", err);
      setErrorMessage(
        err instanceof Error && err.message
          ? `Processing failed: ${err.message}`
          : "Failed to process image. Please try a different image format (PNG, JPG, WEBP) or a smaller file size."
      );
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Handle uploaded file
  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select a valid image file (JPG, PNG, WEBP).");
        return;
      }

      // Max 25MB safety check
      if (file.size > 25 * 1024 * 1024) {
        setErrorMessage("File size exceeds 25MB limit. Please choose a smaller photo.");
        return;
      }

      setErrorMessage(null);
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type.split("/")[1]?.toUpperCase() || "IMG",
        previewUrl,
        rawFile: file,
      });

      // Start processing automatically
      processBackgroundRemoval(file);
    },
    [processBackgroundRemoval]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  // Clear and reset state
  const handleReset = useCallback(() => {
    if (selectedImage?.previewUrl) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }
    if (resultImageUrl) {
      URL.revokeObjectURL(resultImageUrl);
    }
    setSelectedImage(null);
    setResultImageUrl(null);
    setResultBlob(null);
    setIsProcessing(false);
    setProgress(0);
    setStatusText("");
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [selectedImage, resultImageUrl]);

  // Download resulting transparent PNG
  const handleDownload = useCallback(() => {
    if (!resultImageUrl || !selectedImage) return;

    const link = document.createElement("a");
    const baseName = selectedImage.name.replace(/\.[^/.]+$/, "");
    link.href = resultImageUrl;
    link.download = `${baseName}-no-bg.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [resultImageUrl, selectedImage]);

  // Copy cutout image to clipboard (as PNG Blob)
  const handleCopyImage = useCallback(async () => {
    if (!resultBlob) return;
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": resultBlob,
          }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  }, [resultBlob]);

  return (
    <div className="w-full space-y-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={handleInputChange}
        className="hidden"
        id="bg-remove-upload-input"
      />

      {/* Upload Zone (Visible when no image is selected) */}
      {!selectedImage && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all duration-200 ${
            isDragOver
              ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 scale-[1.008]"
              : "border-slate-300 dark:border-slate-700/80 bg-white/60 dark:bg-slate-900/60 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50/80 dark:hover:bg-slate-900/90"
          } shadow-sm backdrop-blur-sm`}
        >
          <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-500/15 transition-transform duration-200">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100">
                Drop your image here, or{" "}
                <span className="text-indigo-600 dark:text-indigo-400 underline underline-offset-4 decoration-indigo-400/50 group-hover:decoration-indigo-500">
                  browse files
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Supports JPG, PNG, and WEBP photos (up to 25MB).
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                100% In-Browser Privacy
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60">
                <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                On-Device AI (WASM)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-sm animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <div className="flex-1 min-w-0">
            <p className="font-medium">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="p-1 rounded-md hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Workspace Area: Processing / Results */}
      {selectedImage && (
        <div className="space-y-6">
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                <FileImage className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs sm:max-w-md">
                  {selectedImage.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {selectedImage.size} • {selectedImage.type}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Another Image</span>
              </button>

              {resultImageUrl && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>
              )}
            </div>
          </div>

          {/* Processing Progress Banner */}
          {isProcessing && (
            <div className="p-5 rounded-2xl border border-indigo-200/70 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/40 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                  <span>{statusText || "Processing image..."}</span>
                </div>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {progress > 0 ? `${progress}%` : "Running AI"}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-indigo-200/60 dark:bg-indigo-900/80 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.max(progress, 8)}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                ⚡ The neural model runs 100% locally in your browser. First run may take a few seconds to load the WebAssembly runtime.
              </p>
            </div>
          )}

          {/* Side-by-Side Comparison Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* 1. Original Image */}
            <div className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Original Image
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {selectedImage.size}
                </span>
              </div>

              <div className="relative flex-1 min-h-[280px] sm:min-h-[340px] flex items-center justify-center p-4 bg-slate-100/50 dark:bg-slate-950/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage.previewUrl}
                  alt="Original upload"
                  className="max-h-[320px] max-w-full object-contain rounded-lg shadow-xs"
                />
              </div>
            </div>

            {/* 2. Transparent Background Result */}
            <div className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Removed Background
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    PNG
                  </span>
                </div>

                {resultBlob && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {formatFileSize(resultBlob.size)}
                  </span>
                )}
              </div>

              {/* Preview with transparency checkerboard pattern */}
              <div
                className="relative flex-1 min-h-[280px] sm:min-h-[340px] flex items-center justify-center p-4"
                style={{
                  backgroundImage:
                    "repeating-conic-gradient(#cbd5e1 0% 25%, #f1f5f9 0% 50%)",
                  backgroundSize: "16px 16px",
                }}
              >
                {/* Dark mode overlay pattern */}
                <div className="absolute inset-0 dark:block hidden pointer-events-none opacity-90"
                  style={{
                    backgroundImage:
                      "repeating-conic-gradient(#1e293b 0% 25%, #0f172a 0% 50%)",
                    backgroundSize: "16px 16px",
                  }}
                />

                {isProcessing && (
                  <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-white/90 dark:bg-slate-900/90 rounded-2xl backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg max-w-xs">
                    <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {statusText || "Processing Cutout..."}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Detecting edges and isolating subject...
                      </p>
                    </div>
                  </div>
                )}

                {!isProcessing && resultImageUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={resultImageUrl}
                    alt="Background removed result"
                    className="relative z-10 max-h-[320px] max-w-full object-contain rounded-lg drop-shadow-md animate-in zoom-in-95 duration-200"
                  />
                )}
              </div>

              {/* Action Buttons for Result */}
              {resultImageUrl && (
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCopyImage}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Image</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Cutout PNG</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
