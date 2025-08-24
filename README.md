# Resumind — AI Resume Analyzer

A small learning project that analyzes uploaded resumes (PDF) and returns AI-powered feedback and ATS (Applicant Tracking System) scores. This project demonstrates a full-stack React app using React Router, TailwindCSS, client-side file handling, and an external "Puter" runtime exposed on `window.puter` for storage and AI calls.

This repository is a learning project based on the JSM tutorial on YouTube: https://youtu.be/iYOz165wGkQ?si=6rNlGDtTYBsKFp-r

What it does

- Upload a PDF resume (single page supported) via the UI ([app/components/FileUploader.tsx](app/components/FileUploader.tsx)).
- Convert the first PDF page to an image ([`convertPdfToImage`](app/lib/pdf2img.ts)).
- Upload resume and generated image to the browser-hosted Puter storage via [`usePuterStore`](app/lib/puter.ts).
- Request AI feedback using a prepared instruction prompt ([`prepareInstructions`](app/constants/index.ts)) and store the parsed JSON feedback.
- View a resume detail page with score, ATS suggestions, and categorized feedback ([app/routes/Resume.tsx](app/routes/Resume.tsx)).

Key entry points

- App root and layout: [app/root.tsx](app/root.tsx)
- Route configuration: [app/routes.ts](app/routes.ts)
- Upload flow: [app/routes/Upload.tsx](app/routes/Upload.tsx)
- Resume detail: [app/routes/Resume.tsx](app/routes/Resume.tsx)
- Puter wrapper + state: [`usePuterStore`](app/lib/puter.ts)
- PDF → image conversion: [`convertPdfToImage`](app/lib/pdf2img.ts)
- AI prompt formatting: [`prepareInstructions`](app/constants/index.ts)

Run locally

1. Install deps:

```bash
npm install
```
