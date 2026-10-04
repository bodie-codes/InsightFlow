# InsightFlow

**Turn customer reviews into decisions.**

[Live demo](https://insight-flow-tawny-alpha.vercel.app)

<!-- Screenshot: nahraj ho do složky docs/ a odkomentuj další řádek
![InsightFlow](docs/insightflow.png)
-->

An AI-powered B2B SaaS platform for analyzing customer feedback. Upload a CSV of customer reviews and InsightFlow uses AI to measure sentiment, surface the biggest pain points and recommend what to fix first, in seconds.

## How it works

1. **Upload your reviews.** Export reviews from any platform as a CSV file. InsightFlow finds the review and rating columns automatically.
2. **AI reads every review.** A large language model classifies up to 50 reviews one by one, so every number is backed by real data.
3. **Know what to fix first.** You get the most critical pain points with real customer quotes and concrete actions your team can take today.

## Try it

Open the [live demo](https://insight-flow-tawny-alpha.vercel.app) and click **Try live demo**. No sign-up is needed for the demo. You can also sign in with GitHub.

## Tech stack

- **Next.js** and **TypeScript**
- **Groq API** for the large language model that analyzes the reviews
- **NextAuth.js** with GitHub sign-in
- **Prisma** with **PostgreSQL**
- Hosted on **Vercel**

## Run locally

```bash
git clone https://github.com/bodie-codes/InsightFlow.git
cd InsightFlow
npm install
```

Create a `.env` file in the project root with your own values:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/insightflow
GROQ_API_KEY=your-groq-api-key
GITHUB_ID=your-github-oauth-app-client-id
GITHUB_SECRET=your-github-oauth-app-client-secret
NEXTAUTH_SECRET=choose-a-long-random-string
```

| Variable | What it is |
|---|---|
| `DATABASE_URL` | Connection string of an empty PostgreSQL database |
| `GROQ_API_KEY` | Groq API key (free accounts at [console.groq.com](https://console.groq.com)) |
| `GITHUB_ID`, `GITHUB_SECRET` | Credentials of a GitHub OAuth app, created at [github.com/settings/developers](https://github.com/settings/developers) with the callback URL `http://localhost:3000/api/auth/callback/github` |
| `NEXTAUTH_SECRET` | Any long random string used to secure sessions |

Create the database tables from the Prisma schema and start the app:

```bash
npx prisma db push
npm run dev
```

Then open <http://localhost:3000>.

## Author

Built by **Bodie** · [bodiecodes.com](https://www.bodiecodes.com) · [LinkedIn](https://www.linkedin.com/in/bodiecodes)
