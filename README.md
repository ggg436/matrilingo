# Build a Duolingo Clone With Nextjs, React, Drizzle, Stripe (2024)

![Duolingo thumb (1)](https://github.com/AntonioErdeljac/next14-duolingo-clone/assets/23248726/d58e4b55-bb09-456f-978e-f5f31e81b870)

This is a repository for a "Build a Duolingo Clone With Nextjs, React, Drizzle, Stripe (2024)" youtube video.

[VIDEO TUTORIAL](https://www.youtube.com/watch?v=dP75Khfy4s4)

Key Features:
- 🌐 Next.js 14 & server actions
- 🗣 AI Voices using Elevenlabs AI
- 🎨 Beautiful component system using Shadcn UI
- 🎭 Amazing characters thanks to KenneyNL
- 🔐 Auth using Clerk
- 🔊 Sound effects
- ❤️ Hearts system
- 🌟 Points / XP system
- 💔 No hearts left popup
- 🚪 Exit confirmation popup
- 🔄 Practice old lessons to regain hearts
- 🏆 Leaderboard
- 🗺 Quests milestones
- 🛍 Shop system to exchange points with hearts
- 💳 Pro tier for unlimited hearts using Stripe
- 🏠 Landing page
- 📊 Admin dashboard React Admin
- 🌧 ORM using DrizzleORM
- 💾 PostgresDB using NeonDB
- 🚀 Deployment on Vercel
- 📱 Mobile responsiveness

## Language Selection Feature

The application now supports choosing your preferred language for the UI. This setting is stored in your browser's localStorage and will be remembered between visits.

### Features:
- Select from multiple UI languages (English, Nepali, Bhojpuri, Maithili, etc.)
- Questions and instructions are displayed in your preferred language
- Fallback to English when content isn't available in your selected language
- Language preference is persisted in localStorage

### How to Use:
1. Change your language from the dropdown in the sidebar
2. Your preference will be saved automatically
3. Navigate to "Language Settings" to see an example of how questions will appear in your chosen language

### Prerequisites

**Node version 14.x**

### Cloning the repository

```shell
git clone https://github.com/AntonioErdeljac/next14-duolingo-clone.git
```

### Install packages

```shell
npm i
```

### Setup .env file


```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
DATABASE_URL="postgresql://..."
STRIPE_API_KEY=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
STRIPE_WEBHOOK_SECRET=""
```

### Setup Drizzle ORM

```shell
npm run db:push

```

### Seed the app

```shell
npm run db:seed

```

or

```shell
npm run db:prod

```

### Start the app

```shell
npm run dev
```
