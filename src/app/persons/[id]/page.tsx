import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import PublicNav from '@/components/PublicNav'

export const revalidate = 0

export default async function PersonDetailPage({ params }: { params: { id: string } }) {
  const person = await prisma.person.findUnique({ where: { id: params.id } })
  if (!person) notFound()

  return (
    <>
      <PublicNav />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/persons" className="text-sm text-indigo-600 hover:underline mb-8 inline-block">
          ← Alle Personen
        </Link>
        <div className="card p-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {person.image ? (
              <Image
                src={person.image}
                alt={person.name}
                width={128}
                height={128}
                className="h-32 w-32 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600 font-bold text-4xl">
                {person.name[0]}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{person.name}</h1>
              {person.role && <p className="text-indigo-600 mt-1 font-medium">{person.role}</p>}
              <p className="text-xs text-gray-400 mt-2">
                Eingetragen am {new Date(person.createdAt).toLocaleDateString('de-DE')}
              </p>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-100 pt-6">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{person.description}</p>
          </div>
        </div>
      </main>
    </>
  )
}
