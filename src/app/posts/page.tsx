import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import PublicNav from '@/components/PublicNav'

export const revalidate = 0

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <PublicNav />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Beiträge</h1>
        {posts.length === 0 ? (
          <p className="text-gray-400">Noch keine Beiträge veröffentlicht.</p>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <Link key={post.id} href={`/posts/${post.id}`} className="card p-6 flex gap-5 items-start hover:shadow-md transition-shadow">
                {post.image && (
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={100}
                    height={100}
                    className="h-24 w-24 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
                  <p className="mt-2 text-gray-600 line-clamp-3">{post.content}</p>
                  <p className="mt-3 text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString('de-DE', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
