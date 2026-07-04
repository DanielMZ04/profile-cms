import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { surah: string } }) {
  const surah = Number(params.surah)
  if (!surah || surah < 1 || surah > 114) {
    return NextResponse.json({ error: 'Ungültige Sure.' }, { status: 400 })
  }
  const rows = await prisma.tafseerAsadi.findMany({
    where: { verseKey: { startsWith: `${surah}:` } },
    select: { verseKey: true, textAr: true, textDe: true },
  })
  return NextResponse.json(rows)
}
