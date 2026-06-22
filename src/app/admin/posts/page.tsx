import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import DeleteButton from '@/components/DeleteButton'

export const revalidate = 0

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Fatwas</h1>
        <Link href="/admin/posts/new" className="btn-primary">+ Neue Fatwa</Link>
      </div>

      {posts.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">Noch keine Fatwas angelegt.</div>
      ) : (
        <div className="card divide-y divide-gray-100 overflow-hidden">
          {posts.map(post => (
            <div key={post.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{post.title}</p>
                <p className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString('de-DE')} ·{' '}
                  <span className={post.published ? 'text-green-600' : 'text-amber-600'}>
                    {post.published ? 'Veröffentlicht' : 'Entwurf'}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/admin/posts/${post.id}/edit`} className="btn-secondary text-xs py-1">Bearbeiten</Link>
                <DeleteButton url={`/api/admin/posts/${post.id}`} label="Löschen" confirm={`"${post.title}" wirklich löschen?`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
