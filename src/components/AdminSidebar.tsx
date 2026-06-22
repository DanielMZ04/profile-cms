'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Gelehrte', href: '/admin/persons' },
  { label: 'Fatwas', href: '/admin/posts' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  if (pathname === '/admin/login') return null

  return (
    <aside className="w-56 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="px-5 py-6 border-b border-gray-800">
        <p className="text-xs text-gray-400 uppercase tracking-wider">Admin</p>
        <p className="mt-1 font-semibold truncate">{session?.user?.name ?? '…'}</p>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-3">
        {navItems.map(item => {
          const active =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="block w-full text-center text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Fatwa Deutschland →
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full rounded-lg border border-gray-700 py-2 text-xs text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          Abmelden
        </button>
      </div>
    </aside>
  )
}
