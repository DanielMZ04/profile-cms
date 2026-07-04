import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/require-admin'
import { sanitizeText } from '@/lib/sanitize'
import { CATEGORY_IDS } from '@/lib/categories'

const postSchema = z.object({
  title: z.string().min(1).max(300),
  content: z.string().min(1).max(100000),
  image: z.string().max(500).nullable().optional(),
  audio: z.string().max(500).nullable().optional(),
  category: z.enum(CATEGORY_IDS).optional().nullable(),
  personId: z.string().max(50).optional().nullable(),
  published: z.boolean().optional(),
})

export async function GET() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })

  const parsed = postSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const { title, content, image, audio, category, personId, published } = parsed.data
  const post = await prisma.post.create({
    data: {
      title: sanitizeText(title, 300),
      content: sanitizeText(content, 100000),
      image: image ?? null,
      audio: audio ?? null,
      category: category ?? null,
      personId: personId || null,
      published: published ?? true,
    },
  })

  return NextResponse.json(post, { status: 201 })
}
