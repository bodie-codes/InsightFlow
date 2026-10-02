import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ error: 'Chybí ID položky' }, { status: 400 });
    }

    await prisma.analysis.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Chyba při mazání z historie:', error);
    return NextResponse.json({ error: 'Chyba při mazání' }, { status: 500 });
  }
}