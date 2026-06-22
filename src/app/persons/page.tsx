import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import PublicNav from '@/components/PublicNav'

export const revalidate = 0

export default async function PersonsPage() {
  const persons = await prisma.person.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <>
      <PublicNav />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Personen</h1>
        {persons.length === 0 ? (
          <p className="text-gray-400">Noch keine Personen eingetragen.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {persons.map(p => (
              <Link key={p.id} href={`/persons/${p.id}`} className="card p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4 text-indigo-600 font-bold text-3xl">
                    {p.name[0]}
                  </div>
                )}
                <h2 className="font-semibold text-gray-900 text-lg">{p.name}</h2>
                {p.role && <p className="text-sm text-indigo-600 mt-1">{p.role}</p>}
                <p className="mt-2 text-sm text-gray-500 line-clamp-3">{p.description}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
