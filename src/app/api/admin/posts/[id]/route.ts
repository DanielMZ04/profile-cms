import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/require-admin'
import { sanitizeText } from '@/lib/sanitize'

const postSchema = z.object({
  title: z.string().min(1).max(300),
  content: z.string().min(1).max(100000),
  image: z.string().max(500).optional().nullable(),
  published: z.boolean().optional(),
})

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const post = await prisma.post.findUnique({ where: { id: params.id } })
  if (!post) return NextResponse.json({ error: 'Nicht gefunden.' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })

  const parsed = postSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const { title, content, image, published } = parsed.data
  const post = await prisma.post.update({
    where: { id: params.id },
    data: {
      title: sanitizeText(title, 300),
      content: sanitizeText(content, 100000),
      image: image ?? null,
      published: published ?? true,
    },
  })

  return NextResponse.json(post)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  await prisma.post.delete({ where: { id: params.id } }).catch(() => null)
  return new NextResponse(null, { status: 204 })
}
