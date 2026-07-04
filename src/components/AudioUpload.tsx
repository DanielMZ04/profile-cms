'use client'

import { useState, useRef } from 'react'

interface Props {
  current?: string | null
  onUploaded: (url: string) => void
}

export default function AudioUpload({ current, onUploaded }: Props) {
  const [audioUrl, setAudioUrl] = useState<string | null>(current ?? null)
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
    formData.append('kind', 'audio')

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? 'Upload fehlgeschlagen.')
        return
      }

      setAudioUrl(json.url)
      onUploaded(json.url)
    } catch {
      setError('Netzwerkfehler beim Upload.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      {audioUrl ? (
        <div className="flex items-center gap-3">
          <audio controls src={audioUrl} className="h-10 max-w-full" preload="metadata" />
          <button
            type="button"
            onClick={() => { setAudioUrl(null); onUploaded('') }}
            className="h-6 w-6 shrink-0 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
            title="Audio entfernen"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-secondary text-xs"
        >
          {uploading ? 'Lädt…' : 'Audio hochladen'}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="audio/mpeg,audio/mp4,audio/x-m4a,audio/ogg,audio/wav,audio/webm"
        onChange={handleChange}
        className="hidden"
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
      <p className="text-xs text-gray-400">MP3, M4A, OGG, WAV · max. 20 MB</p>
    </div>
  )
}
