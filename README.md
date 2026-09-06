# FastDev ⚡ — Developer & Freelancer Utility Toolkit

FastDev is a fast, lightweight, privacy-first developer and freelancer utility platform built with **Next.js 14+ (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## 🚀 Features & Scaffolding

- **Next.js App Router**: Optimized layout and routing architecture.
- **Tailwind CSS with Light & Dark Mode**: Seamless theme switching with system detection and persistence.
- **Comprehensive SEO Scaffolding**:
  - Open Graph & Twitter Cards configured via Next.js Metadata API.
  - Semantic HTML5 landmark tags (`main`, `nav`, `section`, `footer`) and strict heading hierarchy (single `<h1>` on homepage).
  - Dynamic `app/sitemap.ts` and `app/robots.ts` configured for search engine indexation.
  - JSON-LD structured schema (`WebApplication`).
- **Zero-Config Vercel Ready**: Out-of-the-box optimized configuration for rapid deployment.

---

## 📁 Project Folder Structure

```
fastdev/
├── app/
│   ├── favicon.ico
│   ├── globals.css         # Global Tailwind CSS styles and theme variables
│   ├── layout.tsx          # Root App Router layout with Navbar, Footer & SEO Metadata
│   ├── page.tsx            # Homepage with Hero, Tool Cards, and Features
│   ├── robots.ts           # Dynamic robots.txt configuration
│   └── sitemap.ts          # Dynamic sitemap.xml generator
├── components/
│   ├── Footer.tsx          # Semantic footer component
│   ├── Navbar.tsx          # Semantic navigation bar with branding & mobile menu
│   ├── ThemeProvider.tsx   # Light/dark theme context & storage
│   └── ThemeToggle.tsx     # Theme switcher button
├── public/                 # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

### 🛠 Adding Future Tools (`/tools/`)
Tool pages will be added under the `app/tools/` directory. For example:
- `app/tools/case-converter/page.tsx` — **Text Case Converter**
- `app/tools/image-to-text/page.tsx` — **Image to Text (OCR)**
- `app/tools/freelance-word-checker/page.tsx` — **Fiverr/Upwork Word Checker**

When adding new tools, register their routes in [`app/sitemap.ts`](file:///c:/Users/Siam%20Sheikh/Desktop/fastdev/app/sitemap.ts) for automatic search indexing.

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js 18.17+ or higher
- npm, pnpm, or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🚢 Deployment on Vercel

FastDev is structured for zero-configuration deployment on [Vercel](https://vercel.com):

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the repository into the **Vercel Dashboard**.
3. Vercel will automatically detect **Next.js** and apply the default build command (`npm run build`) and output directory (`.next`).
4. (Optional) Set the `NEXT_PUBLIC_SITE_URL` environment variable to your production domain (e.g., `https://fastdev.tools`).
5. Click **Deploy**.

---

## 📄 License
MIT © FastDev
