import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { checkLoginRateLimit, resetLoginRateLimit } from './rate-limit'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        username: { label: 'Benutzername', type: 'text' },
        password: { label: 'Passwort', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) return null

        const ip =
          (req.headers?.['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ??
          '127.0.0.1'

        const rateCheck = checkLoginRateLimit(ip)
        if (!rateCheck.allowed) {
          const minutes = Math.ceil(rateCheck.retryAfterMs / 60_000)
          throw new Error(`Zu viele Versuche. Bitte warte ${minutes} Minute(n).`)
        }

        const user = await prisma.adminUser.findUnique({
          where: { username: credentials.username },
        })

        if (!user) return null

        const valid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!valid) return null

        resetLoginRateLimit(ip)
        return { id: user.id, name: user.username }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.name = token.name as string
      return session
    },
  },
}
