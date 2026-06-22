import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const revalidate = 0

export default async function AdminDashboard() {
  const [personsCount, postsCount] = await Promise.all([
    prisma.person.count(),
    prisma.post.count(),
  ])

  const stats = [
    { label: 'Gelehrte', count: personsCount, href: '/admin/persons', newHref: '/admin/persons/new' },
    { label: 'Fatwas', count: postsCount, href: '/admin/posts', newHref: '/admin/posts/new' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">
        Hier verwaltest du Inhalte für <span className="font-medium text-indigo-600">Fatwa Deutschland</span>.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {stats.map(s => (
          <div key={s.label} className="card p-6">
            <p className="text-sm text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className="text-4xl font-bold text-indigo-600 mt-1">{s.count}</p>
            <div className="mt-4 flex gap-3">
              <Link href={s.href} className="btn-secondary text-xs">Verwalten</Link>
              <Link href={s.newHref} className="btn-primary text-xs">+ Neu</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
