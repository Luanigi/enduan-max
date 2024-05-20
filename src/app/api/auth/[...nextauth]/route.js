import NextAuth from "next-auth"
import google from 'next-auth/providers/google'

const handler = NextAuth ({
  providers: [
    google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({session, token}) {
      session.user.username = session.user.name.split(' ').join('').toLocaleLowerCase();
      session.user.uid = token.sub;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export {handler as GET, handler as POST};