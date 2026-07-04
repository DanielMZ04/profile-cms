'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'

interface InitialData {
  id?: string
  name?: string
  arabicName?: string | null
  translit?: string | null
  era?: string | null
  role?: string | null
  description?: string
  works?: string | null
  image?: string | null
}

export default function PersonForm({ initialData }: { initialData?: InitialData }) {
  const router = useRouter()
  const isEdit = !!initialData?.id

  const [name, setName] = useState(initialData?.name ?? '')
  const [arabicName, setArabicName] = useState(initialData?.arabicName ?? '')
  const [translit, setTranslit] = useState(initialData?.translit ?? '')
  const [era, setEra] = useState(initialData?.era ?? '')
  const [role, setRole] = useState(initialData?.role ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [works, setWorks] = useState(initialData?.works ?? '')
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
      body: JSON.stringify({
        name,
        arabicName: arabicName || null,
        translit: translit || null,
        era: era || null,
        role: role || undefined,
        description,
        works: works || null,
        image: image || null,
      }),
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
        <label className="label">Arabischer Name</label>
        <input
          type="text"
          className="input"
          dir="rtl"
          value={arabicName}
          onChange={e => setArabicName(e.target.value)}
          maxLength={200}
          placeholder="z. B. محمد بن صالح العثيمين"
        />
      </div>

      <div>
        <label className="label">Transkription (lateinische Schrift)</label>
        <input
          type="text"
          className="input"
          value={translit}
          onChange={e => setTranslit(e.target.value)}
          maxLength={200}
          placeholder="z. B. Muhammad ibn Salih al-Uthaymin"
        />
      </div>

      <div>
        <label className="label">Lebensdaten / Ära</label>
        <input
          type="text"
          className="input"
          value={era}
          onChange={e => setEra(e.target.value)}
          maxLength={100}
          placeholder="z. B. 1925–2001"
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
          placeholder="z. B. Hadith-Gelehrter, Fiqh…"
        />
      </div>

      <div>
        <label className="label">Biographie *</label>
        <textarea
          className="input min-h-[160px] resize-y"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          maxLength={10000}
        />
      </div>

      <div>
        <label className="label">Werke (ein Werk pro Zeile)</label>
        <textarea
          className="input min-h-[120px] resize-y"
          value={works}
          onChange={e => setWorks(e.target.value)}
          maxLength={10000}
          placeholder={'Format: Titel | arabischer Titel | Beschreibung\nz. B. Sharh al-Mumti | الشرح الممتع | Fiqh-Kommentar in 15 Bänden'}
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
