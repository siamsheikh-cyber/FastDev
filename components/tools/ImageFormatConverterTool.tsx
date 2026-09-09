"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  Download,
  RotateCcw,
  Sparkles,
  Sliders,
  Check,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  AlertTriangle,
  Layers,
  FileCheck,
  Maximize2,
  RefreshCw,
} from "lucide-react";

type SupportedOutputFormat = "webp" | "jpeg" | "png" | "avif";

interface OriginalImageState {
  file: File;
  name: string;
  baseName: string;
  size: number;
  type: string;
  dimensions: { width: number; height: number };
  previewUrl: string;
}

interface ConvertedImageState {
  blob: Blob;
  size: number;
  previewUrl: string;
  format: SupportedOutputFormat;
  /** True if the browser silently fell back from AVIF to another format */
  avifFallbackDetected?: boolean;
  quality: number;
  filename: string;
  dimensions: { width: number; height: number };
}

export function ImageFormatConverterTool() {
  const [originalImage, setOriginalImage] = useState<OriginalImageState | null>(null);
  const [targetFormat, setTargetFormat] = useState<SupportedOutputFormat>("webp");
  const [quality, setQuality] = useState<number>(90);
  const [jpegBgColor, setJpegBgColor] = useState<string>("#ffffff");
  const [convertedImage, setConvertedImage] = useState<ConvertedImageState | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  // null = detection pending, true = supported, false = not supported
  const [avifSupported, setAvifSupported] = useState<boolean | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Track the previous converted blob URL for revocation — avoids capturing
  // convertedImage state in performConversion's useCallback deps.
  const prevConvertedUrlRef = useRef<string | null>(null);

  // Format file size utility
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Detect AVIF encoding support on mount.
  // Strategy: encode a tiny 1×1 canvas as AVIF; if the browser
  // silently falls back it returns a PNG/JPEG blob that is notably
  // larger than a real AVIF blob for the same 1-px image, OR the
  // blob's type won't be "image/avif". We read the blob type to decide.
  useEffect(() => {
    const testCanvas = document.createElement("canvas");
    testCanvas.width = 1;
    testCanvas.height = 1;
    const ctx = testCanvas.getContext("2d");
    if (!ctx) { setAvifSupported(false); return; }
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(0, 0, 1, 1);
    testCanvas.toBlob((blob) => {
      // If blob is null or the MIME type is not image/avif, browser doesn't support it.
      if (blob && blob.type === "image/avif") {
        setAvifSupported(true);
      } else {
        setAvifSupported(false);
      }
    }, "image/avif");
  }, []);

  // Convert canvas to blob using native Canvas API
  const performConversion = useCallback(
    async (
      imgState: OriginalImageState,
      format: SupportedOutputFormat,
      q: number,
      bg: string
    ) => {
      setIsConverting(true);
      setErrorMessage(null);

      try {
        const img = new window.Image();
        img.crossOrigin = "anonymous";

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () =>
            reject(new Error("Failed to load image into canvas memory."));
          img.src = imgState.previewUrl;
        });

        const canvas = canvasRef.current || document.createElement("canvas");
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          throw new Error("Could not initialize 2D canvas context.");
        }

        ctx.clearRect(0, 0, width, height);

        // For JPEG, fill background because JPEG does not support transparency
        if (format === "jpeg") {
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        const mimeType =
          format === "jpeg"
            ? "image/jpeg"
            : format === "webp"
            ? "image/webp"
            : format === "avif"
            ? "image/avif"
            : "image/png";

        const qualityFraction = format === "png" ? undefined : Math.max(0.01, Math.min(1, q / 100));

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(
            (b) => resolve(b),
            mimeType,
            qualityFraction
          );
        });

        if (!blob) {
          throw new Error(`Browser failed to generate ${format.toUpperCase()} blob.`);
        }

        // Detect AVIF silent fallback: browser may accept the mime type but
        // produce a PNG/JPEG blob instead. If the resulting blob type doesn't
        // match the requested mime, flag it so the UI can warn the user.
        const avifFallbackDetected =
          format === "avif" && blob.type !== "image/avif";

        // Revoke previous converted blob URL to avoid memory leak.
        // Use a ref so we don't need convertedImage in the useCallback deps
        // (which would cause an infinite useEffect re-trigger loop).
        if (prevConvertedUrlRef.current) {
          URL.revokeObjectURL(prevConvertedUrlRef.current);
        }

        const newPreviewUrl = URL.createObjectURL(blob);
        prevConvertedUrlRef.current = newPreviewUrl;

        const ext = format === "jpeg" ? "jpg" : format;
        const newFilename = `${imgState.baseName}.${ext}`;

        setConvertedImage({
          blob,
          size: blob.size,
          previewUrl: newPreviewUrl,
          format,
          quality: q,
          filename: newFilename,
          dimensions: { width, height },
          avifFallbackDetected,
        });
      } catch (err: unknown) {
        console.error("Conversion error:", err);
        const msg =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while converting the image.";
        setErrorMessage(msg);
      } finally {
        // Always clear the spinner, regardless of success or failure.
        setIsConverting(false);
      }
    },
    // Empty deps: prevConvertedUrlRef is a ref (stable), no state needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Trigger conversion whenever format, quality, or background changes
  useEffect(() => {
    if (originalImage) {
      const timer = setTimeout(() => {
        performConversion(originalImage, targetFormat, quality, jpegBgColor);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [originalImage, targetFormat, quality, jpegBgColor, performConversion]);

  // Handle uploaded file
  const handleFile = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage(
        `Unsupported file type "${file.type || "unknown"}". Please upload a valid image (JPEG, PNG, WEBP, GIF, BMP, SVG).`
      );
      return;
    }

    setErrorMessage(null);

    // Clean base name without original extension
    const lastDotIndex = file.name.lastIndexOf(".");
    const baseName =
      lastDotIndex !== -1 ? file.name.substring(0, lastDotIndex) : file.name;

    // Clean up previous URLs
    if (originalImage?.previewUrl) {
      URL.revokeObjectURL(originalImage.previewUrl);
    }
    if (prevConvertedUrlRef.current) {
      URL.revokeObjectURL(prevConvertedUrlRef.current);
      prevConvertedUrlRef.current = null;
    }

    const previewUrl = URL.createObjectURL(file);

    // Read dimensions
    const img = new window.Image();
    img.onload = () => {
      const newOriginal: OriginalImageState = {
        file,
        name: file.name,
        baseName: baseName || "converted-image",
        size: file.size,
        type: file.type,
        dimensions: {
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
        },
        previewUrl,
      };
      setOriginalImage(newOriginal);
      // Auto-set default target format if uploaded image is already that format
      if (file.type === "image/webp" && targetFormat === "webp") {
        setTargetFormat("png");
      } else if (file.type === "image/png" && targetFormat === "png") {
        setTargetFormat("webp");
      }
    };
    img.onerror = () => {
      setErrorMessage(
        "Could not decode the selected image. Please make sure the file is not corrupted."
      );
      URL.revokeObjectURL(previewUrl);
    };
    img.src = previewUrl;
  };

  // Drag & drop handlers
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  // Clear / Reset
  const handleClear = () => {
    if (originalImage?.previewUrl) {
      URL.revokeObjectURL(originalImage.previewUrl);
    }
    if (convertedImage?.previewUrl) {
      URL.revokeObjectURL(convertedImage.previewUrl);
    }
    setOriginalImage(null);
    setConvertedImage(null);
    setErrorMessage(null);
    setIsConverting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Download converted image
  const handleDownload = () => {
    if (!convertedImage?.previewUrl) return;

    const link = document.createElement("a");
    link.href = convertedImage.previewUrl;
    link.download = convertedImage.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  // Sample image generator for instant 1-click test
  const handleLoadSample = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 675;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Vibrant gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#1e1b4b");
    gradient.addColorStop(0.5, "#312e81");
    gradient.addColorStop(1, "#0f172a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative geometric accents
    ctx.fillStyle = "rgba(99, 102, 241, 0.15)";
    ctx.beginPath();
    ctx.arc(1000, 150, 300, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(6, 182, 212, 0.12)";
    ctx.beginPath();
    ctx.arc(200, 500, 250, 0, Math.PI * 2);
    ctx.fill();

    // Shield / Icon shape
    ctx.fillStyle = "#6366f1";
    ctx.beginPath();
    ctx.roundRect(100, 100, 120, 120, [24]);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 56px system-ui, -apple-system, sans-serif";
    ctx.fillText("FearDev", 250, 175);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 24px system-ui, -apple-system, sans-serif";
    ctx.fillText("IMAGE FORMAT CONVERTER DEMO", 250, 215);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "28px system-ui, -apple-system, sans-serif";
    ctx.fillText("High-Resolution Lossless Sample Graphic (1200x675)", 100, 340);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "20px monospace";
    ctx.fillText("Client-Side Canvas Processing • Zero Cloud Uploads • WEBP / AVIF / JPEG / PNG", 100, 390);

    // Badge preview box
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(100, 460, 500, 130, [16]);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#a5b4fc";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.fillText("COMPRESSION & FIDELITY BENCHMARK", 130, 505);

    ctx.fillStyle = "#ffffff";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("Toggle between WEBP, JPEG & PNG to evaluate size savings.", 130, 545);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "feardev-sample-graphic.png", {
          type: "image/png",
        });
        handleFile(file);
      }
    }, "image/png");
  };

  // Calculate size change percentage
  const sizeDiffPercent =
    originalImage && convertedImage
      ? ((convertedImage.size - originalImage.size) / originalImage.size) * 100
      : 0;

  const isSmaller = sizeDiffPercent < 0;
  const savedBytes =
    originalImage && convertedImage
      ? originalImage.size - convertedImage.size
      : 0;

  return (
    <div className="w-full space-y-8">
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/svg+xml,image/*"
        onChange={handleFileInputChange}
        className="hidden"
        id="image-file-input"
      />

      {/* Upload Zone (Shown when no image is loaded) */}
      {!originalImage && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-3xl border-2 border-dashed transition-all duration-200 p-8 sm:p-12 text-center flex flex-col items-center justify-center cursor-pointer group ${
            isDragOver
              ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[1.005] shadow-lg shadow-indigo-500/10"
              : "border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-slate-50/80 dark:hover:bg-slate-900/80 shadow-sm"
          }`}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload image to convert format"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          {/* Decorative Background Glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

          {/* Icon Badge */}
          <div className="relative mb-5 flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-xl shadow-indigo-500/25 group-hover:scale-110 transition-transform duration-300">
            <UploadCloud className="w-10 h-10" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
            Drop your image here, or{" "}
            <span className="text-indigo-600 dark:text-indigo-400 underline underline-offset-4 decoration-indigo-300 dark:decoration-indigo-700 group-hover:decoration-indigo-500">
              browse files
            </span>
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
            Supports <strong className="font-semibold text-slate-800 dark:text-slate-200">JPG, PNG, WEBP, GIF, BMP, and SVG</strong>. Instant in-browser conversion with customizable compression.
          </p>

          {/* Supported Format Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {["JPEG", "PNG", "WEBP", "GIF", "BMP", "SVG"].map((fmt) => (
              <span
                key={fmt}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80"
              >
                {fmt}
              </span>
            ))}
          </div>

          {/* Sample Button & Privacy Trust Badge */}
          <div className="flex flex-col sm:flex-row items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl border border-indigo-200 dark:border-indigo-800 transition-colors shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Load High-Res Demo Image</span>
            </button>

            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Private (Never leaves your device)</span>
            </span>
          </div>
        </div>
      )}

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 flex items-start gap-3 animate-in fade-in duration-150">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm leading-relaxed">
            <p className="font-semibold mb-0.5">Conversion Notice</p>
            <p>{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-rose-700 dark:hover:text-rose-200 p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Workspace (When image is loaded) */}
      {originalImage && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Configuration & Control Bar */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/80">
              {/* File Info Meta */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                      {originalImage.name}
                    </h2>
                    <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {originalImage.type.replace("image/", "").toUpperCase() || "IMAGE"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Original: {originalImage.dimensions.width} × {originalImage.dimensions.height} px • {formatFileSize(originalImage.size)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Choose Another</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* Conversion Controls (Format Selector & Quality Slider) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Output Format Tabs */}
              <div className="md:col-span-6 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Target Output Format</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {([
                    { id: "webp", label: "WEBP", subtitle: "Best for Web", badge: "Recommended", avifOnly: false },
                    { id: "avif", label: "AVIF", subtitle: "Next-Gen Efficient", badge: "Modern", avifOnly: true },
                    { id: "jpeg", label: "JPEG", subtitle: "Universal Photos", badge: "Compressed", avifOnly: false },
                    { id: "png", label: "PNG", subtitle: "Lossless + Alpha", badge: "Lossless", avifOnly: false },
                  ] as const).map((fmt) => {
                    const isSelected = targetFormat === fmt.id;
                    const isAvifOption = fmt.id === "avif";
                    // Disable AVIF if support check is done and result is false.
                    // While pending (null) keep it enabled so users aren't blocked.
                    const isDisabled = isAvifOption && avifSupported === false;
                    return (
                      <div key={fmt.id} className="relative group/fmt">
                        <button
                          type="button"
                          disabled={isDisabled}
                          onClick={() => !isDisabled && setTargetFormat(fmt.id as SupportedOutputFormat)}
                          className={`w-full relative p-3 rounded-2xl border text-left transition-all duration-150 ${
                            isDisabled
                              ? "opacity-40 cursor-not-allowed bg-slate-50/60 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800"
                              : isSelected
                              ? "bg-indigo-50/90 dark:bg-indigo-950/70 border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs cursor-pointer"
                              : "bg-slate-50/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-bold ${
                              isDisabled
                                ? "text-slate-400 dark:text-slate-600"
                                : isSelected
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-slate-900 dark:text-white"
                            }`}>
                              {fmt.label}
                            </span>
                            {isSelected && !isDisabled && (
                              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                <Check className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] block text-slate-500 dark:text-slate-400 font-medium leading-tight">
                            {isDisabled ? "Not supported in your browser" : fmt.subtitle}
                          </span>
                        </button>

                        {/* AVIF unsupported tooltip */}
                        {isAvifOption && isDisabled && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none hidden group-hover/fmt:block">
                            <div className="bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-medium leading-snug px-3 py-2 rounded-xl shadow-xl w-44 text-center">
                              AVIF encoding is not supported in your browser. Try Chrome 85+ or Edge 85+. Use <strong>WEBP</strong> instead.
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quality Slider (for WEBP, AVIF and JPEG) */}
              <div className="md:col-span-6 space-y-2">
                {targetFormat !== "png" ? (
                  <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="quality-slider" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Compression Quality</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800/60">
                          {quality}%
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {quality >= 90 ? "(High Quality)" : quality >= 70 ? "(Balanced)" : "(High Compression)"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <input
                        id="quality-slider"
                        type="range"
                        min="10"
                        max="100"
                        step="1"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
                        <span>10% (Smaller size)</span>
                        <span>50%</span>
                        <span>90% (Recommended)</span>
                        <span>100% (Max fidelity)</span>
                      </div>
                    </div>

                    {/* JPEG Background Color Selector */}
                    {targetFormat === "jpeg" && (
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-400">
                          Transparent Background Fill:
                        </span>
                        <div className="flex items-center gap-1.5">
                          {[
                            { color: "#ffffff", label: "White" },
                            { color: "#000000", label: "Black" },
                          ].map((b) => (
                            <button
                              key={b.color}
                              type="button"
                              onClick={() => setJpegBgColor(b.color)}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border cursor-pointer ${
                                jpegBgColor === b.color
                                  ? "bg-indigo-600 text-white border-indigo-600"
                                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                              }`}
                            >
                              {b.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Info className="w-4 h-4" />
                    </div>
                    <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      <strong className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                        PNG uses Lossless Deflate Compression
                      </strong>
                      Quality compression slider is not applicable. PNG retains 100% pixel fidelity with full alpha transparency.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Before & After Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Image Card */}
            <div className="flex flex-col rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/30">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Original Image
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {formatFileSize(originalImage.size)}
                  </span>
                </div>
              </div>

              {/* Original Preview Frame */}
              <div className="relative flex-1 min-h-[260px] sm:min-h-[320px] max-h-[420px] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-slate-100/50 dark:bg-slate-950/50 flex items-center justify-center p-4 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={originalImage.previewUrl}
                  alt="Original upload preview"
                  className="max-h-[300px] w-auto max-w-full object-contain rounded-xl shadow-md"
                />
              </div>

              <div className="p-4 bg-slate-50/80 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Format: {originalImage.type || "image"}</span>
                <span>Dimensions: {originalImage.dimensions.width} × {originalImage.dimensions.height} px</span>
              </div>
            </div>

            {/* Converted Output Card */}
            <div className="flex flex-col rounded-3xl bg-white dark:bg-slate-900/80 border-2 border-indigo-500/40 dark:border-indigo-500/30 shadow-md shadow-indigo-500/5 overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-indigo-100 dark:border-indigo-950/80 flex items-center justify-between bg-indigo-50/40 dark:bg-indigo-950/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Converted Output</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-600 text-white uppercase">
                      {targetFormat}
                    </span>
                  </h3>
                </div>

                {convertedImage && (
                  <div className="flex items-center gap-2">
                    {/* Size Difference Badge */}
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${
                        isSmaller
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800/60"
                      }`}
                    >
                      {isSmaller
                        ? `${sizeDiffPercent.toFixed(1)}% (${formatFileSize(savedBytes)} saved)`
                        : `+${Math.abs(sizeDiffPercent).toFixed(1)}%`}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200">
                      {formatFileSize(convertedImage.size)}
                    </span>
                  </div>
                )}
              </div>

              {/* Converted Preview Frame */}
              <div className="relative flex-1 min-h-[260px] sm:min-h-[320px] max-h-[420px] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-slate-100/50 dark:bg-slate-950/50 flex flex-col items-center justify-center p-4 overflow-hidden gap-3">
                {isConverting ? (
                  <div className="flex flex-col items-center gap-3 text-indigo-600 dark:text-indigo-400">
                    <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-semibold">Encoding {targetFormat.toUpperCase()} with Canvas API...</span>
                  </div>
                ) : convertedImage?.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={convertedImage.previewUrl}
                    alt={`Converted ${targetFormat} preview`}
                    className="max-h-[270px] w-auto max-w-full object-contain rounded-xl shadow-md animate-in fade-in duration-150"
                  />
                ) : null}

                {/* AVIF silent-fallback warning: browser accepted the call but produced a different format */}
                {!isConverting && convertedImage?.avifFallbackDetected && (
                  <div className="w-full flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 animate-in fade-in duration-200">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                    <div className="text-[11px] leading-snug">
                      <strong className="font-bold block mb-0.5">AVIF encoding failed silently</strong>
                      Your browser accepted the AVIF request but produced a different format instead. The downloaded file may not be a real AVIF. Switch to <button type="button" className="underline font-semibold cursor-pointer" onClick={() => setTargetFormat("webp")}>WEBP</button> for guaranteed compatibility.
                    </div>
                  </div>
                )}
              </div>

              {/* Download Action Footer */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-indigo-50/50 dark:from-slate-900/90 dark:to-indigo-950/40 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                  Output: <strong className="font-semibold text-slate-800 dark:text-slate-200">{convertedImage?.filename}</strong>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!convertedImage || isConverting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Downloaded Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download {targetFormat.toUpperCase()} ({convertedImage ? formatFileSize(convertedImage.size) : "..."})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trust & Safety Highlights Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">
              100% Client-Side Privacy
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Images are converted locally in your browser memory using HTML5 Canvas. Zero bytes sent to any remote server.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">
              Zero Latency & No Limits
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Instant conversions without upload queues, file size paywalls, or daily conversion caps.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">
              Optimized WEBP Compression
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Reduce image payload by up to 80% for lightning-fast page speed scores and Core Web Vitals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
