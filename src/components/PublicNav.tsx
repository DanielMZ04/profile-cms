import Link from 'next/link'

export default function PublicNav() {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          Profile & Beiträge
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/persons" className="hover:text-indigo-600 transition-colors">
            Personen
          </Link>
          <Link href="/posts" className="hover:text-indigo-600 transition-colors">
            Beiträge
          </Link>
        </nav>
      </div>
    </header>
  )
}
