import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import dbConnect from '@/app/db/connectDb'
import Users from '@/app/models/Users'

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        await dbConnect()
        
        if (account.provider === "google") {
          const existingUser = await Users.findOne({ email: user.email })
          
          if (!existingUser) {
            await Users.create({
              email: user.email,
              username: user.email.split("@")[0],
              name: user.name,
              picture: user.image
            })
          }
        }
        return true
      } catch (error) {
        console.error("SignIn error:", error)
        return false
      }
    },
    async session({ session }) {
      await dbConnect()
      const dbUser = await Users.findOne({ email: session.user.email })
      
      if (dbUser) {
        session.user.id = dbUser._id
        session.user.username = dbUser.username
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin'
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }