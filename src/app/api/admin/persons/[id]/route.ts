import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/require-admin'
import { sanitizeText } from '@/lib/sanitize'

const personSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(10000),
  role: z.string().max(200).optional(),
  image: z.string().max(500).optional().nullable(),
})

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const person = await prisma.person.findUnique({ where: { id: params.id } })
  if (!person) return NextResponse.json({ error: 'Nicht gefunden.' }, { status: 404 })
  return NextResponse.json(person)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })

  const parsed = personSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const { name, description, role, image } = parsed.data
  const person = await prisma.person.update({
    where: { id: params.id },
    data: {
      name: sanitizeText(name, 200),
      description: sanitizeText(description, 10000),
      role: role ? sanitizeText(role, 200) : null,
      image: image ?? null,
    },
  })

  return NextResponse.json(person)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  await prisma.person.delete({ where: { id: params.id } }).catch(() => null)
  return new NextResponse(null, { status: 204 })
}
