import { prisma } from '@/lib/prisma'
import CategoryManager from '@/components/CategoryManager'

export const revalidate = 0

export default async function AdminCategoriesPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      category: true,
      createdAt: true,
      person: { select: { name: true } },
    },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Kategorien</h1>
      <CategoryManager
        initialPosts={posts.map(p => ({
          id: p.id,
          title: p.title,
          category: p.category,
          scholar: p.person?.name ?? null,
          createdAt: p.createdAt.toISOString(),
        }))}
      />
    </div>
  )
}
