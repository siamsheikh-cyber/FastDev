# FearDev

**FearDev** is a free, open collection of essential utility tools built for developers and freelancers. Instead of hunting across multiple websites for small daily tasks, FearDev brings several practical, privacy-focused tools together in one place — all running client-side in your browser.

🔗 **Live site:** [https://feardev.vercel.app](https://feardev.vercel.app)
📦 **Repository:** [https://github.com/siamsheikh-cyber/FearDev](https://github.com/siamsheikh-cyber/FearDev)

## Why FearDev?

Developers and freelancers — especially those working on platforms like Fiverr and Upwork — run into small but recurring problems during daily work: inconsistent text formatting from clients, extracting text from screenshots instead of retyping, needing to phrase client messages carefully to avoid violating marketplace rules, converting images between formats, and removing backgrounds from images for quick design or product needs. FearDev solves these specific pain points with simple, fast, single-purpose tools — with zero backend and zero data upload, since everything runs directly in the browser.

## Tools

### Text Tools
- Text Case Converter — Convert text between UPPERCASE, lowercase, Title Case, and Sentence case instantly.
- Fiverr/Upwork Word Checker — Scans your message for restricted/risky words and suggests safe, professional alternative phrasing.

### Image Tools
- Image to Text (OCR) — Extract text from screenshots and images using in-browser OCR (Tesseract.js).
- Image Format Converter — Convert images between JPEG, PNG, WEBP, and AVIF formats with adjustable quality via the Canvas API.
- Image Background Remover — Remove image backgrounds instantly using an on-device AI model, no upload required.

## Tech Stack

- Framework: Next.js (App Router) with TypeScript
- Styling: Tailwind CSS
- OCR: Tesseract.js
- Background Removal: @imgly/background-removal (on-device, WASM-based)
- Image Conversion: Native browser Canvas API
- Hosting: Vercel

## Key Features

- Instant & zero latency — most tools process instantly, right in your browser
- 100% privacy-focused — no images or text are ever uploaded to a server
- Developer & freelancer centric — built around real, everyday pain points
- SEO & AI-search optimized — structured metadata, sitemap, and llms.txt for discoverability

## Getting Started (Local Development)

```bash
git clone https://github.com/siamsheikh-cyber/FearDev.git
cd FearDev
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## License

All rights reserved © 2026 FearDev.
