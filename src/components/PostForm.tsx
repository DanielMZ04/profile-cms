'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'
import AudioUpload from './AudioUpload'
import { CATEGORIES } from '@/lib/categories'

interface InitialData {
  id?: string
  title?: string
  content?: string
  image?: string | null
  audio?: string | null
  category?: string | null
  personId?: string | null
  published?: boolean
}

interface PersonOption {
  id: string
  name: string
}

export default function PostForm({ initialData, persons = [] }: { initialData?: InitialData; persons?: PersonOption[] }) {
  const router = useRouter()
  const isEdit = !!initialData?.id

  const [title, setTitle] = useState(initialData?.title ?? '')
  const [content, setContent] = useState(initialData?.content ?? '')
  const [image, setImage] = useState(initialData?.image ?? '')
  const [audio, setAudio] = useState(initialData?.audio ?? '')
  const [category, setCategory] = useState(initialData?.category ?? '')
  const [personId, setPersonId] = useState(initialData?.personId ?? '')
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
      body: JSON.stringify({ title, content, image: image || null, audio: audio || null, category: category || null, personId: personId || null, published }),
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

      <div>
        <label className="label">Gelehrter</label>
        <select
          className="input"
          value={personId}
          onChange={e => setPersonId(e.target.value)}
        >
          <option value="">– kein Gelehrter –</option>
          {persons.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-400">Gelehrte werden unter „Gelehrte" angelegt.</p>
      </div>

      <div>
        <label className="label">Kategorie</label>
        <select
          className="input"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">– keine Kategorie –</option>
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Audio (z. B. Fatwa-Aufnahme)</label>
        <AudioUpload current={audio || null} onUploaded={url => setAudio(url)} />
        <div className="mt-3">
          <label className="label text-xs text-gray-500">…oder Audio-URL einfügen (z. B. von der Quellseite)</label>
          <input
            type="url"
            className="input"
            value={audio.startsWith('http') ? audio : ''}
            onChange={e => setAudio(e.target.value)}
            maxLength={500}
            placeholder="https://…/fatwa-123.mp3"
          />
        </div>
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
