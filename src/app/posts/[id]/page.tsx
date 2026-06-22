import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import PublicNav from '@/components/PublicNav'

export const revalidate = 0

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({ where: { id: params.id, published: true } })
  if (!post) notFound()

  return (
    <>
      <PublicNav />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/posts" className="text-sm text-indigo-600 hover:underline mb-8 inline-block">
          ← Alle Beiträge
        </Link>
        <article className="card p-8">
          {post.image && (
            <Image
              src={post.image}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-56 object-cover rounded-lg mb-6"
            />
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
          <p className="text-sm text-gray-400 mb-6">
            {new Date(post.createdAt).toLocaleDateString('de-DE', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </p>
          <div className="border-t border-gray-100 pt-6">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
          </div>
        </article>
      </main>
    </>
  )
}
