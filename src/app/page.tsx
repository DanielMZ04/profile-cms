import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import PublicNav from '@/components/PublicNav'

export const revalidate = 0

export default async function HomePage() {
  const [persons, posts] = await Promise.all([
    prisma.person.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
  ])

  return (
    <>
      <PublicNav />
      <main className="mx-auto max-w-5xl px-4 py-12">
        {/* Hero */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Willkommen
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Entdecke Profile und aktuelle Beiträge.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/persons" className="btn-primary">
              Alle Personen
            </Link>
            <Link href="/posts" className="btn-secondary">
              Alle Beiträge
            </Link>
          </div>
        </div>

        {/* Persons preview */}
        {persons.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Personen</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {persons.map(p => (
                <Link key={p.id} href={`/persons/${p.id}`} className="card p-5 flex gap-4 items-start hover:shadow-md transition-shadow">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600 font-bold text-xl">
                      {p.name[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{p.name}</h3>
                    {p.role && <p className="text-xs text-indigo-600 mt-0.5">{p.role}</p>}
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{p.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Posts preview */}
        {posts.length > 0 && (
          <section>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Aktuelle Beiträge</h2>
            <div className="space-y-4">
              {posts.map(post => (
                <Link key={post.id} href={`/posts/${post.id}`} className="card p-5 flex gap-4 items-start hover:shadow-md transition-shadow">
                  {post.image && (
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">{post.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{post.content}</p>
                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {persons.length === 0 && posts.length === 0 && (
          <p className="text-center text-gray-400 text-lg mt-20">
            Noch keine Inhalte vorhanden.
          </p>
        )}
      </main>
    </>
  )
}
