import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PostForm from '@/components/PostForm'

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({ where: { id: params.id } })
  if (!post) notFound()

  const persons = await prisma.person.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Beitrag bearbeiten</h1>
      <PostForm initialData={post} persons={persons} />
    </div>
  )
}
