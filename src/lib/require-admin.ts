import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from './auth'

export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }
  return null
}
