'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface Props {
  current?: string | null
  onUploaded: (url: string) => void
}

export default function ImageUpload({ current, onUploaded }: Props) {
  const [preview, setPreview] = useState<string | null>(current ?? null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? 'Upload fehlgeschlagen.')
        return
      }

      setPreview(json.url)
      onUploaded(json.url)
    } catch {
      setError('Netzwerkfehler beim Upload.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative inline-block">
          <Image
            src={preview}
            alt="Vorschau"
            width={120}
            height={120}
            className="h-28 w-28 rounded-lg object-cover border border-gray-200"
          />
          <button
            type="button"
            onClick={() => { setPreview(null); onUploaded('') }}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
          >
            ×
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex h-28 w-28 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-indigo-400 hover:text-indigo-400 transition-colors text-sm text-center"
        >
          {uploading ? 'Lädt…' : 'Bild\nhinzufügen'}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleChange}
        className="hidden"
      />

      {!preview && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-secondary text-xs"
        >
          {uploading ? 'Lädt…' : 'Bild hochladen'}
        </button>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
      <p className="text-xs text-gray-400">JPEG, PNG, WebP, GIF · max. 5 MB</p>
    </div>
  )
}
