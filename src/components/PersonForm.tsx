'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'

interface InitialData {
  id?: string
  name?: string
  role?: string | null
  description?: string
  image?: string | null
}

export default function PersonForm({ initialData }: { initialData?: InitialData }) {
  const router = useRouter()
  const isEdit = !!initialData?.id

  const [name, setName] = useState(initialData?.name ?? '')
  const [role, setRole] = useState(initialData?.role ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [image, setImage] = useState(initialData?.image ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const url = isEdit ? `/api/admin/persons/${initialData!.id}` : '/api/admin/persons'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, role: role || undefined, description, image: image || null }),
    })

    setSaving(false)

    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      setError(typeof json.error === 'string' ? json.error : 'Bitte alle Pflichtfelder korrekt ausfüllen.')
      return
    }

    router.push('/admin/persons')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 max-w-2xl space-y-5">
      <div>
        <label className="label">Bild</label>
        <ImageUpload current={image || null} onUploaded={url => setImage(url)} />
      </div>

      <div>
        <label className="label">Name *</label>
        <input
          type="text"
          className="input"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          maxLength={200}
        />
      </div>

      <div>
        <label className="label">Rolle / Titel</label>
        <input
          type="text"
          className="input"
          value={role}
          onChange={e => setRole(e.target.value)}
          maxLength={200}
          placeholder="z. B. Geschäftsführer, Autor…"
        />
      </div>

      <div>
        <label className="label">Beschreibung *</label>
        <textarea
          className="input min-h-[160px] resize-y"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          maxLength={10000}
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Speichert…' : isEdit ? 'Änderungen speichern' : 'Person anlegen'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          Abbrechen
        </button>
      </div>
    </form>
  )
}
