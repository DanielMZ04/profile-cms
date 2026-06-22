'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'

interface InitialData {
  id?: string
  title?: string
  content?: string
  image?: string | null
  published?: boolean
}

export default function PostForm({ initialData }: { initialData?: InitialData }) {
  const router = useRouter()
  const isEdit = !!initialData?.id

  const [title, setTitle] = useState(initialData?.title ?? '')
  const [content, setContent] = useState(initialData?.content ?? '')
  const [image, setImage] = useState(initialData?.image ?? '')
  const [published, setPublished] = useState(initialData?.published ?? true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const url = isEdit ? `/api/admin/posts/${initialData!.id}` : '/api/admin/posts'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, image: image || null, published }),
    })

    setSaving(false)

    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      setError(typeof json.error === 'string' ? json.error : 'Bitte alle Pflichtfelder korrekt ausfüllen.')
      return
    }

    router.push('/admin/posts')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 max-w-2xl space-y-5">
      <div>
        <label className="label">Titelbild</label>
        <ImageUpload current={image || null} onUploaded={url => setImage(url)} />
      </div>

      <div>
        <label className="label">Titel *</label>
        <input
          type="text"
          className="input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          maxLength={300}
        />
      </div>

      <div>
        <label className="label">Inhalt *</label>
        <textarea
          className="input min-h-[280px] resize-y"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          maxLength={100000}
          placeholder="Beitragstext…"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={e => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="published" className="text-sm font-medium text-gray-700">
          Sofort veröffentlichen
        </label>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Speichert…' : isEdit ? 'Änderungen speichern' : 'Beitrag anlegen'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          Abbrechen
        </button>
      </div>
    </form>
  )
}
