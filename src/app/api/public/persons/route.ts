import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const persons = await prisma.person.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(persons)
}
