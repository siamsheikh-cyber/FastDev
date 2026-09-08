"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Type,
  FileScan,
  ShieldCheck,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface ToolItem {
  name: string;
  href: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  iconBg: string;
}

const textTools: ToolItem[] = [
  {
    name: "Text Case Converter",
    href: "/tools/case-converter",
    description: "Transform camelCase, snake_case, UPPERCASE & more",
    icon: Type,
    badge: "Live",
    badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/60",
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
  },
  {
    name: "Fiverr/Upwork Word Checker",
    href: "/tools/fiverr-word-checker",
    description: "Detect forbidden TOS terms & contact sharing triggers",
    icon: ShieldCheck,
    badge: "Compliance",
    badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  },
];

const imageTools: ToolItem[] = [
  {
    name: "Image to Text (OCR)",
    href: "/tools/image-to-text",
    description: "Extract text and code snippets from images in browser",
    icon: FileScan,
    badge: "OCR",
    badgeColor: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60",
    iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20",
  },
  {
    name: "Image Format Converter",
    href: "/tools/image-format-converter",
    description: "Convert JPG, PNG, WEBP with custom quality & compression",
    icon: ImageIcon,
    badge: "New",
    badgeColor: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60",
    iconBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20",
  },
];

type ActiveDropdown = "text" | "image" | null;

export function Navbar() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTextExpanded, setMobileTextExpanded] = useState(true);
  const [mobileImageExpanded, setMobileImageExpanded] = useState(true);

  const textDropdownRef = useRef<HTMLDivElement>(null);
  const textTriggerRef = useRef<HTMLButtonElement>(null);
  const textItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const imageDropdownRef = useRef<HTMLDivElement>(null);
  const imageTriggerRef = useRef<HTMLButtonElement>(null);
  const imageItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Click outside to close desktop dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedInsideText = textDropdownRef.current?.contains(target);
      const clickedInsideImage = imageDropdownRef.current?.contains(target);

      if (!clickedInsideText && !clickedInsideImage) {
        setActiveDropdown(null);
      }
    }

    if (activeDropdown !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [activeDropdown]);

  // Hover handlers with slight delay for smooth UX
  const handleMouseEnter = useCallback((type: "text" | "image") => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveDropdown(type);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  }, []);

  // Keyboard navigation & accessibility for Text Tools
  const handleTextKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setActiveDropdown(null);
      textTriggerRef.current?.focus();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (activeDropdown !== "text") {
        setActiveDropdown("text");
        setTimeout(() => textItemsRef.current[0]?.focus(), 50);
      } else {
        const activeIndex = textItemsRef.current.findIndex(
          (el) => el === document.activeElement
        );
        const nextIndex = activeIndex < textTools.length - 1 ? activeIndex + 1 : 0;
        textItemsRef.current[nextIndex]?.focus();
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (activeDropdown === "text") {
        const activeIndex = textItemsRef.current.findIndex(
          (el) => el === document.activeElement
        );
        const prevIndex = activeIndex > 0 ? activeIndex - 1 : textTools.length - 1;
        textItemsRef.current[prevIndex]?.focus();
      }
    }
  };

  // Keyboard navigation & accessibility for Image Tools
  const handleImageKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setActiveDropdown(null);
      imageTriggerRef.current?.focus();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (activeDropdown !== "image") {
        setActiveDropdown("image");
        setTimeout(() => imageItemsRef.current[0]?.focus(), 50);
      } else {
        const activeIndex = imageItemsRef.current.findIndex(
          (el) => el === document.activeElement
        );
        const nextIndex = activeIndex < imageTools.length - 1 ? activeIndex + 1 : 0;
        imageItemsRef.current[nextIndex]?.focus();
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (activeDropdown === "image") {
        const activeIndex = imageItemsRef.current.findIndex(
          (el) => el === document.activeElement
        );
        const prevIndex = activeIndex > 0 ? activeIndex - 1 : imageTools.length - 1;
        imageItemsRef.current[prevIndex]?.focus();
      }
    }
  };

  const isTextDropdownOpen = activeDropdown === "text";
  const isImageDropdownOpen = activeDropdown === "image";

  const isTextRouteActive = textTools.some((tool) => pathname === tool.href);
  const isImageRouteActive = imageTools.some((tool) => pathname === tool.href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo & Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="group flex items-center gap-2.5 transition-transform duration-200"
              aria-label="FearDev Homepage"
            >
              <div className="relative flex items-center overflow-hidden">
                <Image
                  src="/feardev.jpg"
                  alt="FearDev"
                  width={140}
                  height={48}
                  className="h-12 w-42 object-cover"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center gap-1.5"
              aria-label="Main Navigation"
            >
              {/* 1. Text Tools Dropdown */}
              <div
                ref={textDropdownRef}
                className="relative"
                onMouseEnter={() => handleMouseEnter("text")}
                onMouseLeave={handleMouseLeave}
                onBlur={(e) => {
                  if (!textDropdownRef.current?.contains(e.relatedTarget as Node)) {
                    if (activeDropdown === "text") setActiveDropdown(null);
                  }
                }}
                onKeyDown={handleTextKeyDown}
              >
                <button
                  ref={textTriggerRef}
                  type="button"
                  id="text-tools-menu-button"
                  aria-haspopup="true"
                  aria-expanded={isTextDropdownOpen}
                  aria-controls="text-tools-dropdown-menu"
                  onClick={() =>
                    setActiveDropdown((prev) => (prev === "text" ? null : "text"))
                  }
                  className={`group flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 ${
                    isTextDropdownOpen || isTextRouteActive
                      ? "bg-indigo-50/90 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <Type
                    className={`w-4 h-4 transition-colors ${
                      isTextDropdownOpen || isTextRouteActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                    }`}
                  />
                  <span>Text Tools</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ease-out ${
                      isTextDropdownOpen
                        ? "rotate-180 text-indigo-600 dark:text-indigo-400"
                        : "text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                    }`}
                  />
                </button>

                {/* Text Tools Dropdown Menu */}
                <div
                  id="text-tools-dropdown-menu"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="text-tools-menu-button"
                  className={`absolute left-0 top-full pt-2 w-80 z-50 transition-all duration-200 origin-top-left ${
                    isTextDropdownOpen
                      ? "opacity-100 scale-100 translate-y-0 pointer-events-auto visible"
                      : "opacity-0 scale-95 -translate-y-1 pointer-events-none invisible"
                  }`}
                >
                  <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-2 shadow-xl shadow-slate-900/10 dark:shadow-2xl dark:shadow-black/50 ring-1 ring-black/5 dark:ring-white/5 space-y-1">
                    <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Text Utilities
                      </span>
                      <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                        {textTools.length} Tools
                      </span>
                    </div>

                    <div className="py-1 space-y-1">
                      {textTools.map((tool, idx) => {
                        const Icon = tool.icon;
                        const isCurrent = pathname === tool.href;

                        return (
                          <Link
                            key={tool.name}
                            ref={(el) => {
                              textItemsRef.current[idx] = el;
                            }}
                            href={tool.href}
                            role="menuitem"
                            tabIndex={isTextDropdownOpen ? 0 : -1}
                            onClick={() => setActiveDropdown(null)}
                            className={`group flex items-start gap-3 p-2.5 rounded-xl transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 ${
                              isCurrent
                                ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                                : "hover:bg-slate-100/90 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200"
                            }`}
                          >
                            <div
                              className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-transform group-hover:scale-105 ${tool.iconBg}`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1.5 mb-0.5">
                                <span className="text-sm font-semibold truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {tool.name}
                                </span>
                                {tool.badge && (
                                  <span
                                    className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full border shrink-0 ${tool.badgeColor}`}
                                  >
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
                                {tool.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Image Tools Dropdown */}
              <div
                ref={imageDropdownRef}
                className="relative"
                onMouseEnter={() => handleMouseEnter("image")}
                onMouseLeave={handleMouseLeave}
                onBlur={(e) => {
                  if (!imageDropdownRef.current?.contains(e.relatedTarget as Node)) {
                    if (activeDropdown === "image") setActiveDropdown(null);
                  }
                }}
                onKeyDown={handleImageKeyDown}
              >
                <button
                  ref={imageTriggerRef}
                  type="button"
                  id="image-tools-menu-button"
                  aria-haspopup="true"
                  aria-expanded={isImageDropdownOpen}
                  aria-controls="image-tools-dropdown-menu"
                  onClick={() =>
                    setActiveDropdown((prev) => (prev === "image" ? null : "image"))
                  }
                  className={`group flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 ${
                    isImageDropdownOpen || isImageRouteActive
                      ? "bg-indigo-50/90 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <ImageIcon
                    className={`w-4 h-4 transition-colors ${
                      isImageDropdownOpen || isImageRouteActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                    }`}
                  />
                  <span>Image Tools</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ease-out ${
                      isImageDropdownOpen
                        ? "rotate-180 text-indigo-600 dark:text-indigo-400"
                        : "text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                    }`}
                  />
                </button>

                {/* Image Tools Dropdown Menu */}
                <div
                  id="image-tools-dropdown-menu"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="image-tools-menu-button"
                  className={`absolute left-0 top-full pt-2 w-80 z-50 transition-all duration-200 origin-top-left ${
                    isImageDropdownOpen
                      ? "opacity-100 scale-100 translate-y-0 pointer-events-auto visible"
                      : "opacity-0 scale-95 -translate-y-1 pointer-events-none invisible"
                  }`}
                >
                  <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-2 shadow-xl shadow-slate-900/10 dark:shadow-2xl dark:shadow-black/50 ring-1 ring-black/5 dark:ring-white/5 space-y-1">
                    <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Image Utilities
                      </span>
                      <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                        {imageTools.length} Tools
                      </span>
                    </div>

                    <div className="py-1 space-y-1">
                      {imageTools.map((tool, idx) => {
                        const Icon = tool.icon;
                        const isCurrent = pathname === tool.href;

                        return (
                          <Link
                            key={tool.name}
                            ref={(el) => {
                              imageItemsRef.current[idx] = el;
                            }}
                            href={tool.href}
                            role="menuitem"
                            tabIndex={isImageDropdownOpen ? 0 : -1}
                            onClick={() => setActiveDropdown(null)}
                            className={`group flex items-start gap-3 p-2.5 rounded-xl transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 ${
                              isCurrent
                                ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                                : "hover:bg-slate-100/90 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200"
                            }`}
                          >
                            <div
                              className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-transform group-hover:scale-105 ${tool.iconBg}`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1.5 mb-0.5">
                                <span className="text-sm font-semibold truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {tool.name}
                                </span>
                                {tool.badge && (
                                  <span
                                    className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full border shrink-0 ${tool.badgeColor}`}
                                  >
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
                                {tool.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-current" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-5 space-y-3 transition-colors animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Mobile Text Tools Section */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-slate-50/70 dark:bg-slate-900/60 p-3 space-y-2">
            <button
              type="button"
              onClick={() => setMobileTextExpanded((prev) => !prev)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-indigo-500" />
                <span>Text Tools ({textTools.length})</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  mobileTextExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileTextExpanded && (
              <div className="space-y-1.5 pt-1">
                {textTools.map((tool) => {
                  const Icon = tool.icon;
                  const isCurrent = pathname === tool.href;

                  return (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                        isCurrent
                          ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/70"
                          : "bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${tool.iconBg}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-sm font-semibold truncate">
                            {tool.name}
                          </span>
                          {tool.badge && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border shrink-0 ${tool.badgeColor}`}
                            >
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {tool.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile Image Tools Section */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-slate-50/70 dark:bg-slate-900/60 p-3 space-y-2">
            <button
              type="button"
              onClick={() => setMobileImageExpanded((prev) => !prev)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-500" />
                <span>Image Tools ({imageTools.length})</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  mobileImageExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileImageExpanded && (
              <div className="space-y-1.5 pt-1">
                {imageTools.map((tool) => {
                  const Icon = tool.icon;
                  const isCurrent = pathname === tool.href;

                  return (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                        isCurrent
                          ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/70"
                          : "bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${tool.iconBg}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-sm font-semibold truncate">
                            {tool.name}
                          </span>
                          {tool.badge && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border shrink-0 ${tool.badgeColor}`}
                            >
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {tool.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-1">
            <Link
              href="/tools/case-converter"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full text-center text-sm font-semibold py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <span>Launch Case Converter</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
