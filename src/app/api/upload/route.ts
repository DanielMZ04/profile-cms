import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { requireAdmin } from '@/lib/require-admin'
import { sanitizeFilename, validateImageFile } from '@/lib/sanitize'

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) return NextResponse.json({ error: 'Keine Datei hochgeladen.' }, { status: 400 })

  const validationError = validateImageFile(file)
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 })

  const filename = sanitizeFilename(file.name)
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await writeFile(path.join(uploadsDir, filename), buffer)

  return NextResponse.json({ url: `/uploads/${filename}` })
}
