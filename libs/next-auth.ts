import NextAuth, { getServerSession as gSS } from "next-auth";
import type { NextAuthOptions } from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";

import EmailProvider from "next-auth/providers/email";

import config, { server } from "@/config";
import prisma from "@/libs/prisma";
import { sendEmail } from "./sendEmail";



interface NextAuthOptionsExtended extends NextAuthOptions {
  adapter?: any;
}




export const authOptions: NextAuthOptionsExtended = {
  // Set any random key in .env.local
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // Follow the "Login with Email" tutorial to set up your email server
    // Requires a MongoDB database. Set MONOGODB_URI env variable.
    EmailProvider({

      sendVerificationRequest: async (params) => {
        await sendEmail({
          from: "noreply@num4.art",
          to: params.identifier,
          subject: "Sign in to Num4",
          html: `<h1>Sign in</h1><p>Use the code below to sign in:</p><p>${params.token}</p>`,
        })
      },

      generateVerificationToken: async () => {
        return new Promise((resolve) => {
          const token = `${Array(6)
          .fill(() => Math.floor(Math.random() * 10))
          .map((f) => f())
          .join("")}`
          console.log("token", token)
          resolve(token)
        });
      },

      server,
      from: "noreply@num4.art" //server.auth.user,
    }),
    // GoogleProvider({
    //   // Follow the "Login with Google" tutorial to get your credentials
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    //   async profile(profile) {
    //     return {
    //       id: profile.sub,
    //       name: profile.given_name ? profile.given_name : profile.name,
    //       email: profile.email,
    //       image: profile.picture,
    //       createdAt: new Date()
    //     };
    //   }
    // })
  ],
  // New users will be saved in Database (MongoDB Atlas). Each user (model) has some fields like name, email, image, etc..
  // Requires a MongoDB database. Set MONOGODB_URI env variable.
  // Learn more about the model type: https://next-auth.js.org/v3/adapters/models

  callbacks: {
    jwt: ({ user, token }) => {
      return token;
    },
    session: async ({ session, token, user }) => {
      if (session?.user) {
        session.user.id = token.sub || user?.id || session.user.id;
      }

      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  theme: {
    brandColor: config.colors.main,
    // Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
    // It will be used in the login flow to display your logo. If you don't add it, it will look faded.
    logo: `https://${config.domainName}/logoAndName.png`
  },
  pages: {
    signIn: "/me/signin",
    signOut: "/me/signout",
    verifyRequest: "/me/verify", // (used for check email message)
    newUser: "/me/welcome", // New users will be directed here on first sign in (leave the property out if not of interest)

    error: "/me/signin" // Error code passed in query string as ?error=
  }
};

export const getServerSession = () => gSS(authOptions);

export default NextAuth(authOptions);
