import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/require-admin'
import { sanitizeFilename, validateImageFile, validateAudioFile } from '@/lib/sanitize'

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const kind = formData.get('kind') === 'audio' ? 'audio' : 'image'

  if (!file) return NextResponse.json({ error: 'Keine Datei hochgeladen.' }, { status: 400 })

  const validationError = kind === 'audio' ? validateAudioFile(file) : validateImageFile(file)
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 })

  const filename = sanitizeFilename(file.name)
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Production: Supabase Storage (persistent, works on Vercel)
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const objectPath = `${Date.now()}-${filename}`
    const { error } = await supabase.storage
      .from('uploads')
      .upload(objectPath, buffer, { contentType: file.type, upsert: false })
    if (error) {
      return NextResponse.json({ error: `Upload fehlgeschlagen: ${error.message}` }, { status: 500 })
    }
    const { data } = supabase.storage.from('uploads').getPublicUrl(objectPath)
    return NextResponse.json({ url: data.publicUrl })
  }

  // Local development fallback: write to public/uploads
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await writeFile(path.join(uploadsDir, filename), buffer)

  return NextResponse.json({ url: `/uploads/${filename}` })
}
