# InvoiceCraft — Professional Invoice Generator

A fully-featured invoice generator built with **Next.js 16**, **TailwindCSS v4**, and **Zustand**.

## Features

- 6 professional invoice templates (Minimal, Corporate, Grid, Bold, Elegant, Dark)
- GST / IGST tax calculations with discount support
- One-click PDF export and browser print
- Logo upload, accent color picker, column customization
- Save / Load invoices as JSON
- Indian number-to-words amount conversion
- Fully client-side — no backend required

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **TailwindCSS v4**
- **Zustand v5** (persisted state)
- **html2pdf.js** (PDF export)
- **lucide-react** (icons)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm run start
```

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

The app is fully static-compatible and can be deployed to Vercel, Netlify, or any Node.js host.


```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
