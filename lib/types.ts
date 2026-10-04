// Shared types used by both the API and the page

export type Sentiment = "positive" | "neutral" | "negative";

export type ReviewResult = {
  text: string;
  sentiment: Sentiment;
  rating: number | null;
};

export type PainPoint = {
  issue: string;
  quotes: string[];
};

export type AnalysisResult = {
  id: string;
  filename: string;
  totalReviews: number;
  positivePct: number;
  neutralPct: number;
  negativePct: number;
  topComplaints: string[];
  actionItems: string[];
  summary: string | null;
  avgRating: number | null;
  painPoints: PainPoint[] | null;
  reviews: ReviewResult[] | null;
  createdAt: string;
};