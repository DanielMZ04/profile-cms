// Muss mit den Kategorien im Frontend (fatwa-deutschland/src/data/index.ts) übereinstimmen
export const CATEGORIES = [
  { id: 'aqidah', label: 'Aqidah (Glaubenslehre)' },
  { id: 'manhaj', label: 'Manhaj (Methodik)' },
  { id: 'fiqh', label: 'Fiqh (Rechtslehre)' },
  { id: 'hadith', label: 'Hadith' },
  { id: 'prophetic-medicine', label: 'Medizin der Sunnah' },
  { id: 'admonitions', label: 'Ermahnungen' },
  { id: 'sira', label: 'Sira' },
  { id: 'tarikh', label: 'Tarikh' },
] as const

export const CATEGORY_IDS = CATEGORIES.map(c => c.id) as unknown as [string, ...string[]]

export function categoryLabel(id: string | null | undefined): string {
  return CATEGORIES.find(c => c.id === id)?.label ?? '– keine –'
}
