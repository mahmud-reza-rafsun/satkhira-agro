# Farm Calculator — Next.js

সাতক্ষীরা এগ্রোর ফার্ম ক্যালকুলেটর — Next.js প্রজেক্ট। ফার্ম গাইড, ব্যাচের হিসাব,
ক্রয়/খরচ, বিক্রি/ইনকাম, স্থায়ী বিনিয়োগ, ফার্ম টুল (৫টা ক্যালকুলেটর, হাটের তথ্য,
স্টক ম্যানেজমেন্ট), খামার বৃদ্ধির হিসাব, রিপোর্ট ও Excel/Backup — সব আগের মতোই আছে।

## চালানো

```bash
npm install
npm run dev
```

তারপর ব্রাউজারে http://localhost:3000 খুলুন।

প্রোডাকশন বিল্ড:

```bash
npm run build
npm run start
```

## Vercel-এ দেওয়া

GitHub-এ push করার পর Vercel-এ গিয়ে "Add New Project" → এই রিপো সিলেক্ট করুন।
আর কিছু সেট করতে হবে না — Next.js প্রজেক্ট হিসেবে নিজে থেকেই ধরে নেবে।
**তবে একটা জিনিস:** Vercel → Project Settings → Environment Variables-এ
`DATABASE_URL`-এ Neon-এর connection string দিতে হবে, নাহলে API রুটগুলো
ডাটাবেজে পৌঁছাবে না।

## ব্যাকএন্ড — Prisma + Postgres (Neon)

ডাটাবেজের স্কিমা `prisma/schema.prisma`-এ। টেবিল: Batch, LedgerEntry
(ক্রয়/খরচ + বিক্রি/ইনকাম), FixedInvestment, Contact (ক্রেতা/বিক্রেতা),
Staff, Due (বাকি লেনদেন), Todo, BusinessPlan, Stock, GrowthProduct,
Backup, Setting — আগের localStorage ডেটার আয়না, তাই অর্থ বদলায়নি।

API রুট (`app/api/...`): `health`, `batches`, `entries`, `investments`,
`contacts`, `staff`, `stock`, `growth`, `backups`, `dues`, `todos`, `plans` —
সবগুলোতেই GET/POST, আর একটা করে `[id]` রুটে GET/PATCH/DELETE।

সংযোগ: `lib/prisma.ts` Neon-এর serverless (HTTPS) ড্রাইভার ব্যবহার করে
(`@prisma/adapter-neon`)। সরাসরি Postgres TCP সব নেটওয়ার্ক থেকে খোলে না,
তাই এই পথ — Vercel-এও এটাই Neon-এর সুপারিশ করা সেটআপ।

`.env`-এ `DATABASE_URL` থাকে (gitignore করা — কখনো কমিট হয় না)।
স্কিমা বদলালে:

```bash
npm run db:sql    # prisma/schema.sql নতুন করে বানায়
npm run db:apply  # HTTPS দিয়ে Neon-এ প্রয়োগ করে
```

(`prisma db push` সরাসরি Postgres সংযোগ চায়, তাই এই পরিবেশে চলে না।)

**এখনো ফ্রন্টএন্ড localStorage-ই ব্যবহার করে** — API তৈরি আছে, ফ্রন্টএন্ড
সেটার সঙ্গে যুক্ত করা পরের ধাপ।

## কীভাবে পোর্ট করা হয়েছে

মূল অ্যাপটা একটাই HTML ফাইলে ছিল (Muse artifact থেকে এক্সপোর্ট করা)।
সেটা `lib/farm-calculator-source.html`-এ রাখা আছে। Next.js শেল (`app/page.tsx` +
`components/FarmCalculator.tsx`) সেই ফাইলের CSS, মার্কআপ আর স্ক্রিপ্টগুলো
আগের ক্রমেই চালায় — তাই ক্যালকুলেটরের কোনো ফিচার বদলায়নি। ভবিষ্যতে নতুন
ফিচার React কম্পোনেন্ট হিসেবে বানানো যাবে।

## একটা জরুরি কথা — পুরনো হিসাব

ক্যালকুলেটরের হিসাব ব্রাউজারের localStorage-এ জমে, আর সেটা ঠিকানাভেদে আলাদা
হয়। তাই muse.ai-র লিংক বা HTML ফাইলে জমা হিসাব এই নতুন ঠিকানায় (localhost
বা Vercel) নিজে থেকে আসবে না। হিসাব নিতে হলে পুরনো জায়গা থেকে **Backup
ডাউনলোড** করে নতুন জায়গায় **Restore Backup** করুন।

## UI (shadcn)

- **shadcn/ui** বসানো আছে (Tailwind v4 + Radix): টোকেন `app/globals.css`-এ,
  কম্পোনেন্ট `components/ui/`-তে (Button, Input, Label, Select, Popover,
  Calendar), সেটআপ `components.json` + `postcss.config.mjs`।
  প্রাইমারি রং ব্র্যান্ডের সবুজ (`--primary`), বাকি টোকেন shadcn-এর
  neutral প্যালেট।
- ক্যালকুলেটরের আসল অ্যাপটা (পোর্ট করা HTML) React নয়, তাই তার
  ড্রপডাউন/বাটন/ইনপুট/তারিখের ঘরগুলো সরাসরি shadcn কম্পোনেন্ট দিয়ে
  বদলানো যায়নি — বদলে `components/shadcn-overrides.css` লেয়ারটি একই
  shadcn রূপ দেয় (h-10 ঘর, গোল কোণা, বর্ডার, ফোকাস-রিং, সবুজ প্রাইমারি
  বাটন, ডেট-রেঞ্জের দুই তারিখের ঘরসহ)। **লেআউটে কোনো বদল নেই** — ঘরগুলোর
  অবস্থান, চওড়া, গ্রিড সব আগের মতোই আছে।
- নতুন React UI লাগলে `components/ui/`-এর কম্পোনেন্ট সরাসরি ব্যবহার করা
  যাবে (যেমন রিপোর্টের ডেট-রেঞ্জে Popover + Calendar)।
