'use client'

import { useMemo, useState } from 'react'
import { CATEGORIES } from '@/lib/categories'

interface PostItem {
  id: string
  title: string
  category: string | null
  scholar: string | null
  createdAt: string
}

export default function CategoryManager({ initialPosts }: { initialPosts: PostItem[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const [activeCat, setActiveCat] = useState<string>(CATEGORIES[0].id)
  const [adding, setAdding] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const inCategory = useMemo(
    () => posts.filter(p => p.category === activeCat),
    [posts, activeCat]
  )

  // Kandidaten zum Hinzufügen: alle Fatwas, die NICHT in der aktiven Kategorie sind
  const candidates = useMemo(() => {
    const q = search.trim().toLowerCase()
    return posts
      .filter(p => p.category !== activeCat)
      .filter(p => !q || p.title.toLowerCase().includes(q) || (p.scholar ?? '').toLowerCase().includes(q))
  }, [posts, activeCat, search])

  function switchCategory(id: string) {
    setActiveCat(id)
    setAdding(false)
    setSelected(new Set())
    setSearch('')
    setError('')
  }

  function toggleSelected(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function patchCategory(ids: string[], category: string | null) {
    setSaving(true)
    setError('')
    const failed: string[] = []
    for (const id of ids) {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
      }).catch(() => null)
      if (!res || !res.ok) failed.push(id)
    }
    setPosts(prev =>
      prev.map(p => (ids.includes(p.id) && !failed.includes(p.id) ? { ...p, category } : p))
    )
    if (failed.length > 0) setError(`${failed.length} Fatwa(s) konnten nicht gespeichert werden.`)
    setSaving(false)
  }

  async function addSelected() {
    await patchCategory(Array.from(selected), activeCat)
    setSelected(new Set())
    setAdding(false)
    setSearch('')
  }

  const activeLabel = CATEGORIES.find(c => c.id === activeCat)?.label ?? activeCat

  return (
    <div>
      {/* Kategorien oben als Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(c => {
          const count = posts.filter(p => p.category === c.id).length
          return (
            <button
              key={c.id}
              onClick={() => switchCategory(c.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeCat === c.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {c.label} <span className="opacity-70">({count})</span>
            </button>
          )
        })}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Fatwas in der aktiven Kategorie */}
      <div className="card overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-900">
            {activeLabel} <span className="text-gray-400 font-normal">({inCategory.length})</span>
          </h2>
          <button
            onClick={() => { setAdding(a => !a); setSelected(new Set()); setSearch('') }}
            className="btn-primary text-sm py-1.5"
          >
            {adding ? 'Schließen' : '+ Fatwas hinzufügen'}
          </button>
        </div>

        {inCategory.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-gray-400">
            Noch keine Fatwas in dieser Kategorie. Klicke auf „+ Fatwas hinzufügen".
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {inCategory.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm text-gray-900">{p.title}</p>
                  {p.scholar && <p className="truncate text-xs text-indigo-600">{p.scholar}</p>}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(p.createdAt).toLocaleDateString('de-DE')}
                </span>
                <button
                  onClick={() => patchCategory([p.id], null)}
                  disabled={saving}
                  className="text-xs text-red-500 hover:text-red-700"
                  title="Aus Kategorie entfernen"
                >
                  Entfernen
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hinzufügen-Panel: alle Fatwas mit Suche + Häkchen */}
      {adding && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 space-y-3">
            <h3 className="font-semibold text-gray-900">Fatwas zu „{activeLabel}" hinzufügen</h3>
            <input
              type="text"
              className="input"
              placeholder="Nach Titel oder Gelehrtem suchen…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          {candidates.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-400">
              {search ? 'Keine Fatwa gefunden.' : 'Alle Fatwas sind bereits in dieser Kategorie.'}
            </p>
          ) : (
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {candidates.map(p => (
                <label
                  key={p.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => toggleSelected(p.id)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="flex-1 min-w-0 truncate text-sm text-gray-900">
                    {p.title}
                    {p.scholar && <span className="ml-2 text-xs text-indigo-600">· {p.scholar}</span>}
                  </span>
                  {p.category && (
                    <span className="text-xs text-amber-600">
                      bisher: {CATEGORIES.find(c => c.id === p.category)?.label ?? p.category}
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-sm text-gray-500">{selected.size} ausgewählt</p>
            <button
              onClick={addSelected}
              disabled={saving || selected.size === 0}
              className="btn-primary text-sm py-1.5 disabled:opacity-50"
            >
              {saving ? 'Speichert…' : `${selected.size} Fatwa(s) hinzufügen`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
