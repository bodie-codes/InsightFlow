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
- **Prisma** with **PostgreSQL**
- A large language model for review analysis
- Sign in with GitHub
- Hosted on **Vercel**

## Run locally

```bash
git clone https://github.com/bodie-codes/InsightFlow.git
cd InsightFlow
npm install
npm run dev
```

Then open <http://localhost:3000>. The app needs a PostgreSQL database (`DATABASE_URL`) and the keys for its AI model and GitHub sign-in, set in your local `.env` file.

<!-- Sem doplň zbylé názvy proměnných z .env, nikdy ne jejich hodnoty -->

## Author

Built by **Bodie** · [bodiecodes.com](https://www.bodiecodes.com) · [LinkedIn](https://www.linkedin.com/in/bodiecodes)
