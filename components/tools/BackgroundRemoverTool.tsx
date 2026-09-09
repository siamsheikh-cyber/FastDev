"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  UploadCloud,
  Eraser,
  Sparkles,
  Download,
  RotateCcw,
  AlertCircle,
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

const PLAYFUL_CAPTIONS = [
  "Finding the edges...",
  "Teaching pixels to disappear...",
  "Politely asking the background to leave...",
  "Sharpening the outline...",
];

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

  // --- Caption rotation state (completely separate from animation) ---
  const [captionIndex, setCaptionIndex] = useState<number>(0);
  const [captionFade, setCaptionFade] = useState<boolean>(true);

  // --- Laser animation refs (never trigger re-renders) ---
  const laserLineRef = useRef<HTMLDivElement>(null);
  const scanContainerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── LASER ANIMATION LOOP ────────────────────────────────────────────────
  // Runs ONLY when isProcessing flips true/false.
  // Touches ZERO React state — only direct DOM style mutation via refs.
  useEffect(() => {
    if (!isProcessing) {
      // Stop the loop and reset the line position
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      startTimeRef.current = null;
      if (laserLineRef.current) {
        laserLineRef.current.style.transform = "translate3d(0, 0px, 0)";
      }
      return;
    }

    // isProcessing just became true — start the loop
    startTimeRef.current = null;
    const DURATION = 2400; // ms for one full top→bottom→top bounce

    const tick = (now: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = now;
      }

      const elapsed = now - startTimeRef.current;

      // Measure container height each frame (handles layout shifts)
      const containerH = scanContainerRef.current?.clientHeight ?? 280;
      const maxY = Math.max(0, containerH - 3);

      // Seamless cosine ease-in-out ping-pong: 0→maxY→0 over DURATION ms
      const progress = (elapsed % DURATION) / DURATION;
      const ease = 0.5 - 0.5 * Math.cos(progress * 2 * Math.PI);
      const y = ease * maxY;

      if (laserLineRef.current) {
        laserLineRef.current.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      }

      // Schedule next frame — store ID in ref so cleanup can cancel it
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    // Cleanup: cancel if isProcessing turns false OR component unmounts
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isProcessing]); // ONLY depends on isProcessing

  // ─── CAPTION ROTATION (fully separate, no animation deps) ────────────────
  useEffect(() => {
    if (!isProcessing) {
      setCaptionIndex(0);
      setCaptionFade(true);
      return;
    }

    const interval = setInterval(() => {
      setCaptionFade(false);
      setTimeout(() => {
        setCaptionIndex((prev) => (prev + 1) % PLAYFUL_CAPTIONS.length);
        setCaptionFade(true);
      }, 200);
    }, 1800);

    return () => clearInterval(interval);
  }, [isProcessing]);

  // ─── HELPERS ─────────────────────────────────────────────────────────────
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const processBackgroundRemoval = useCallback(async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setStatusText("Initializing AI model...");
    setErrorMessage(null);
    setResultImageUrl(null);
    setResultBlob(null);

    try {
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
                ? `Refining edges (${percent}%)...`
                : "Generating transparent cutout..."
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

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select a valid image file (JPG, PNG, WEBP).");
        return;
      }
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

  const handleReset = useCallback(() => {
    if (selectedImage?.previewUrl) URL.revokeObjectURL(selectedImage.previewUrl);
    if (resultImageUrl) URL.revokeObjectURL(resultImageUrl);
    setSelectedImage(null);
    setResultImageUrl(null);
    setResultBlob(null);
    setIsProcessing(false);
    setProgress(0);
    setStatusText("");
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [selectedImage, resultImageUrl]);

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

  const handleCopyImage = useCallback(async () => {
    if (!resultBlob) return;
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": resultBlob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  }, [resultBlob]);

  // ─── RENDER ──────────────────────────────────────────────────────────────
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

      {/* Upload Zone */}
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

      {/* Workspace Area */}
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
            <div className="p-4 sm:p-5 rounded-2xl border border-indigo-200/70 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-indigo-50/80 dark:from-indigo-950/50 dark:via-purple-950/30 dark:to-indigo-950/50 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse shrink-0" />
                  <span
                    className={`font-semibold text-slate-800 dark:text-slate-100 transition-opacity duration-300 ${
                      captionFade ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {PLAYFUL_CAPTIONS[captionIndex]}
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                  {progress > 0 ? `${progress}%` : "AI SCANNING"}
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-indigo-200/60 dark:bg-indigo-900/80 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.max(progress, 8)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{statusText || "Processing image..."}</span>
                <span>On-device WebAssembly</span>
              </div>
            </div>
          )}

          {/* Side-by-Side Comparison */}
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

            {/* 2. Result / Laser Scan Preview */}
            <div className="flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {isProcessing ? "AI Processing Cutout" : "Removed Background"}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    PNG
                  </span>
                </div>

                {resultBlob && !isProcessing && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {formatFileSize(resultBlob.size)}
                  </span>
                )}
                {isProcessing && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-600 dark:text-cyan-400 animate-pulse">
                    <Eraser className="w-3.5 h-3.5" />
                    <span>Removing...</span>
                  </span>
                )}
              </div>

              {/* Preview container */}
              <div
                className={`relative flex-1 min-h-[280px] sm:min-h-[340px] flex items-center justify-center p-4 overflow-hidden transition-colors ${
                  !isProcessing && resultImageUrl
                    ? ""
                    : "bg-slate-100/50 dark:bg-slate-950/50"
                }`}
                style={
                  !isProcessing && resultImageUrl
                    ? {
                        backgroundImage:
                          "repeating-conic-gradient(#cbd5e1 0% 25%, #f1f5f9 0% 50%)",
                        backgroundSize: "16px 16px",
                      }
                    : undefined
                }
              >
                {/* Dark mode checkerboard overlay — result only */}
                {!isProcessing && resultImageUrl && (
                  <div
                    className="absolute inset-0 dark:block hidden pointer-events-none opacity-90"
                    style={{
                      backgroundImage:
                        "repeating-conic-gradient(#1e293b 0% 25%, #0f172a 0% 50%)",
                      backgroundSize: "16px 16px",
                    }}
                  />
                )}

                {/* ── LASER SCAN VIEW ─────────────────────────────────────
                    Always rendered while selectedImage exists but visually
                    hidden when not processing — this keeps the DOM node
                    stable so the rAF loop can always write to laserLineRef
                    without the element disappearing between renders.
                ─────────────────────────────────────────────────────────── */}
                <div
                  className={`relative z-10 flex flex-col items-center justify-center w-full h-full ${
                    isProcessing ? "block" : "hidden"
                  }`}
                >
                  {/* Image + laser container — measured by rAF loop */}
                  <div
                    ref={scanContainerRef}
                    className="relative inline-flex items-center justify-center overflow-hidden rounded-lg shadow-xs max-h-[320px] max-w-full"
                  >
                    {/* Unobstructed original image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedImage.previewUrl}
                      alt="Scanning preview"
                      className="max-h-[320px] max-w-full object-contain block select-none pointer-events-none"
                    />

                    {/* Laser line — position driven purely by rAF via ref,
                        never by React state. will-change promotes to own layer. */}
                    <div
                      ref={laserLineRef}
                      className="absolute top-0 left-0 w-full h-[3px] pointer-events-none z-20 will-change-transform"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, #22D3EE 20%, #7DF9FF 50%, #22D3EE 80%, transparent 100%)",
                        boxShadow: "0 0 16px 4px rgba(34, 211, 238, 0.7)",
                      }}
                    />
                  </div>

                  {/* Rotating caption — React state, fully isolated from rAF */}
                  <div className="mt-4 px-4 py-1.5 rounded-full bg-slate-900/85 dark:bg-black/85 text-white backdrop-blur-md border border-white/10 shadow-lg flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                    <span
                      className={`font-medium transition-opacity duration-200 text-slate-100 ${
                        captionFade ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {PLAYFUL_CAPTIONS[captionIndex]}
                    </span>
                  </div>
                </div>

                {/* ── FINAL RESULT ───────────────────────────────────────── */}
                {!isProcessing && resultImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resultImageUrl}
                    alt="Background removed result"
                    className="relative z-10 max-h-[320px] max-w-full object-contain rounded-lg drop-shadow-md animate-in fade-in zoom-in-95 duration-300"
                  />
                )}
              </div>

              {/* Action Buttons */}
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
