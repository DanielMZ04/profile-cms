export function sanitizeText(value: unknown, maxLength = 50_000): string {
  if (typeof value !== 'string') throw new Error('Expected string')
  return value
    .replace(/\0/g, '')   // strip null bytes
    .trim()
    .slice(0, maxLength)
}

export function sanitizeFilename(original: string): string {
  const ext = original.split('.').pop()?.toLowerCase() ?? ''
  const safe = ext.replace(/[^a-z0-9]/g, '')
  return `${Date.now()}-${crypto.randomUUID()}.${safe}`
}

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const MAX_FILE_BYTES = 5 * 1024 * 1024 // 5 MB

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) return 'Nur JPEG, PNG, WebP und GIF sind erlaubt.'
  if (file.size > MAX_FILE_BYTES) return 'Bild darf maximal 5 MB groß sein.'
  return null
}
