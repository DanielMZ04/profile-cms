'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CATEGORIES } from '@/lib/categories'

interface Props {
  postId: string
  current: string | null
}

/** Inline-Dropdown in der Fatwa-Liste: Kategorie direkt zuweisen, ohne die Bearbeiten-Seite zu öffnen. */
export default function CategorySelect({ postId, current }: Props) {
  const router = useRouter()
  const [value, setValue] = useState(current ?? '')
  const [saving, setSaving] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const category = e.target.value
    setValue(category)
    setSaving(true)

    const res = await fetch(`/api/admin/posts/${postId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: category || null }),
    })

    setSaving(false)
    if (!res.ok) {
      setValue(current ?? '') // zurücksetzen bei Fehler
      alert('Kategorie konnte nicht gespeichert werden.')
      return
    }
    router.refresh()
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={saving}
      className={`input py-1 text-xs w-44 ${value ? '' : 'text-amber-600'}`}
      title="Kategorie zuweisen"
    >
      <option value="">– keine Kategorie –</option>
      {CATEGORIES.map(c => (
        <option key={c.id} value={c.id}>{c.label}</option>
      ))}
    </select>
  )
}
