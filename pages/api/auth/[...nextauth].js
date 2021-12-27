import NextAuth from 'next-auth/next';
import GoogleProvier from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { singinfirebase } from '../../../firebase';

export default NextAuth({
  providers: [
    GoogleProvier({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Email' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Password',
        },
      },
      async authorize(credentials) {
        let user;
        try {
          user = await singinfirebase(credentials.email, credentials.password);
        } catch (error) {
          throw new Error('Email or Password is not correct');
        }
        if (user) {
          return {
            email: user.user.email,
            id: user.user.uid,
            image:
              'https://firebasestorage.googleapis.com/v0/b/stories-28f15.appspot.com/o/stories%2Fdefault.png?alt=media&token=d293343d-1de7-488a-bf98-7e4e5af53f93',
          };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      return token;
    },
    session: async ({ session, token, user }) => {
      session.user.uid = token.sub;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  secret: 'text',
  jwt: {
    secret: 'text',
  },

  pages: {
    signIn: '/signin',
    error: '/signin',
  },
});
