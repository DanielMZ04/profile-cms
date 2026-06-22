import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PersonForm from '@/components/PersonForm'

export default async function EditPersonPage({ params }: { params: { id: string } }) {
  const person = await prisma.person.findUnique({ where: { id: params.id } })
  if (!person) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Person bearbeiten</h1>
      <PersonForm initialData={person} />
    </div>
  )
}
