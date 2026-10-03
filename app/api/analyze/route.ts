export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import Papa from 'papaparse';

// OpenAI client routed to Groq servers
const openai = new OpenAI({ 
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const email = formData.get('userId') as string; 

    if (!file || !email) {
      return NextResponse.json({ error: 'Missing required file or user ID.' }, { status: 400 });
    }

    // Parse CSV file content
    const fileText = await file.text();
    const parsed = Papa.parse(fileText, { header: true, skipEmptyLines: true });

    if (!parsed.data || parsed.data.length === 0) {
      return NextResponse.json({ error: 'CSV file is empty or invalid.' }, { status: 400 });
    }

    // Robust extraction of review text from various possible column names
    const reviews = parsed.data
      .slice(0, 50)
      .map((row: any) => {
        return (
          row.Review ||
          row.review ||
          row.text ||
          row.Text ||
          row.comment ||
          row.Comment ||
          row.feedback ||
          row.Feedback ||
          Object.values(row).join(' ')
        );
      })
      .filter(Boolean)
      .join('\n---\n');

    // Prompt enforcing professional English output and strict JSON structure
    const prompt = `
      Analyze the following customer reviews. Return ONLY a valid JSON object in English with this exact structure:
      {
        "sentiment": { 
          "positive": (integer 0-100), 
          "neutral": (integer 0-100), 
          "negative": (integer 0-100) 
        },
        "topComplaints": ["concise issue 1", "concise issue 2", "concise issue 3"],
        "actionItems": ["actionable recommendation 1", "actionable recommendation 2", "actionable recommendation 3"]
      }

      Ensure the percentages sum up to 100.
      All text values MUST be written in clear, professional English.

      Customer Reviews:
      ${reviews}
    `;

    // Call Groq API with temperature 0 for deterministic output
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0
    });

    const aiResult = JSON.parse(completion.choices[0].message.content || '{}');

    // Safe fallback values if any field is missing
    const positivePct = aiResult.sentiment?.positive ?? 0;
    const neutralPct = aiResult.sentiment?.neutral ?? 0;
    const negativePct = aiResult.sentiment?.negative ?? 0;
    const topComplaints = aiResult.topComplaints && aiResult.topComplaints.length > 0 
      ? aiResult.topComplaints 
      : ['No critical issues detected'];
    const actionItems = aiResult.actionItems && aiResult.actionItems.length > 0 
      ? aiResult.actionItems 
      : ['Maintain current service quality'];

    // Find actual user profile in PostgreSQL database
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User profile not found in database.' }, { status: 404 });
    }

    // Save analysis results
    const savedAnalysis = await prisma.analysis.create({
      data: {
        userId: user.id,
        filename: file.name,
        totalReviews: parsed.data.length,
        positivePct,
        neutralPct,
        negativePct,
        topComplaints,
        actionItems,
      }
    });

    return NextResponse.json({ success: true, data: savedAnalysis });

  } catch (error) {
    console.error('API /api/analyze error:', error);
    return NextResponse.json({ error: 'Failed to process analysis.' }, { status: 500 });
  }
}