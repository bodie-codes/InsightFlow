import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('userId'); 

    if (!email) {
      return NextResponse.json({ success: false, error: 'Chybí e-mail uživatele.' });
    }

    // 1. Najdeme skutečné ID uživatele podle e-mailu z GitHubu
    const user = await prisma.user.findUnique({ 
      where: { email } 
    });

    if (!user) {
      return NextResponse.json({ success: true, data: [] });
    }

    // 2. Vytáhneme historii přiřazenou k tomuto ID
    const history = await prisma.analysis.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Chyba při načítání historie.' });
  }
}