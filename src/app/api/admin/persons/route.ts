import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/require-admin'
import { sanitizeText } from '@/lib/sanitize'

const personSchema = z.object({
  name: z.string().min(1).max(200),
  arabicName: z.string().max(200).optional().nullable(),
  translit: z.string().max(200).optional().nullable(),
  era: z.string().max(100).optional().nullable(),
  description: z.string().min(1).max(10000),
  works: z.string().max(10000).optional().nullable(),
  role: z.string().max(200).optional(),
  image: z.string().max(500).optional().nullable(),
})

export async function GET() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const persons = await prisma.person.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(persons)
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })

  const parsed = personSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { name, arabicName, translit, era, description, works, role, image } = parsed.data
  const person = await prisma.person.create({
    data: {
      name: sanitizeText(name, 200),
      arabicName: arabicName ? sanitizeText(arabicName, 200) : null,
      translit: translit ? sanitizeText(translit, 200) : null,
      era: era ? sanitizeText(era, 100) : null,
      description: sanitizeText(description, 10000),
      works: works ? sanitizeText(works, 10000) : null,
      role: role ? sanitizeText(role, 200) : null,
      image: image ?? null,
    },
  })

  return NextResponse.json(person, { status: 201 })
}
