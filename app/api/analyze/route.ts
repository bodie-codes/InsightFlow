export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import Papa from 'papaparse';

// Přesměrování OpenAI klienta na bezplatné servery Groq
const openai = new OpenAI({ 
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    // Z frontendu sem teď posíláme e-mail přihlášeného uživatele
    const email = formData.get('userId') as string; 

    if (!file || !email) {
      return NextResponse.json({ error: 'Chybí data' }, { status: 400 });
    }

    // Přečtení obsahu souboru a jeho parsování
    const fileText = await file.text();
    const parsed = Papa.parse(fileText, { header: true, skipEmptyLines: true });
    const reviews = parsed.data.slice(0, 50).map((row: any) => row.review || row.text).join('\n---\n');

    // Prompt pro AI
    const prompt = `
      Analyzuj následující zákaznické recenze. Vrať striktně JSON s následující strukturou:
      {
        "sentiment": { "positive": (číslo 0-100), "neutral": (číslo 0-100), "negative": (číslo 0-100) },
        "topComplaints": ["stížnost 1", "stížnost 2", "stížnost 3"],
        "actionItems": ["návrh 1", "návrh 2", "návrh 3"]
      }
      
      Recenze:
      ${reviews}
    `;

    // Volání Groq API se správným modelem
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" }
    });

    const aiResult = JSON.parse(completion.choices[0].message.content || '{}');

    // 1. Najdeme tvůj skutečný uživatelský profil podle e-mailu z GitHubu
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Uživatel nenalezen v databázi.' }, { status: 404 });
    }

    // 2. Uložení výsledků analýzy přímo pod tvé skutečné ID
    const savedAnalysis = await prisma.analysis.create({
      data: {
        userId: user.id, // Přiřazujeme k reálnému uživateli
        filename: file.name,
        totalReviews: parsed.data.length,
        positivePct: aiResult.sentiment.positive,
        neutralPct: aiResult.sentiment.neutral,
        negativePct: aiResult.sentiment.negative,
        topComplaints: aiResult.topComplaints,
        actionItems: aiResult.actionItems,
      }
    });

    // Odeslání dat zpět na frontend
    return NextResponse.json({ success: true, data: savedAnalysis });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Něco se pokazilo' }, { status: 500 });
  }
}