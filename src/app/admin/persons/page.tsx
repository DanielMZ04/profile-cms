import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import DeleteButton from '@/components/DeleteButton'

export const revalidate = 0

export default async function AdminPersonsPage() {
  const persons = await prisma.person.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gelehrte</h1>
        <Link href="/admin/persons/new" className="btn-primary">+ Neuer Gelehrter</Link>
      </div>

      {persons.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          Noch keine Gelehrten angelegt.
        </div>
      ) : (
        <div className="card divide-y divide-gray-100 overflow-hidden">
          {persons.map(p => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50">
              {p.image ? (
                <Image src={p.image} alt={p.name} width={40} height={40}
                  className="h-10 w-10 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600 font-bold">
                  {p.name[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{p.name}</p>
                {p.role && <p className="text-xs text-gray-500">{p.role}</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/admin/persons/${p.id}/edit`} className="btn-secondary text-xs py-1">Bearbeiten</Link>
                <DeleteButton url={`/api/admin/persons/${p.id}`} label="Löschen" confirm={`"${p.name}" wirklich löschen?`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
