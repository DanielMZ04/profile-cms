import { prisma } from '@/lib/prisma'
import PostForm from '@/components/PostForm'

export default async function NewPostPage() {
  const persons = await prisma.person.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Neue Fatwa anlegen</h1>
      <PostForm persons={persons} />
    </div>
  )
}
