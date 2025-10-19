# 🎰 LuckyPlay

**LuckyPlay** is a demo gambling-style app built for portfolio purposes —  
users can sign in with a demo account, play coin flip and simple games using **fake credits**.

### 🛠 Tech Stack
- Next.js (App Router, TypeScript)
- Prisma ORM (SQLite)
- NextAuth.js (Demo login with credentials or GitHub)
- TailwindCSS
- PNPM for package management

### ⚙️ Setup
```bash
pnpm install
cp .env.example .env
# Fill in NEXTAUTH_SECRET and NEXTAUTH_URL
pnpm prisma db push
pnpm dev
