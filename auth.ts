import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/libs/prisma";
import EmailProvider from "next-auth/providers/nodemailer";
import { sendEmail } from "@/libs/sendEmail";
import type { NextAuthConfig } from "next-auth";
import { server } from "./config";
import crypto from "crypto";

const adapter = PrismaAdapter(prisma);

export const config = {
  adapter,
  session: {
    strategy: "jwt"
  },
  providers: [
    EmailProvider({
      async sendVerificationRequest(params) {
        try {
          const emailPromise = sendEmail({
            from: "noreply@num4.art",
            to: params.identifier,
            subject: "Sign in to Num4",
            html: `<h1>Sign in</h1><p>Use the code below to sign in:</p><p>${params.token}</p>`,
            priority: "high"
          });

          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Email sending timeout")), 30000);
          });

          await Promise.race([emailPromise, timeoutPromise]);

          console.log("Code de vérification envoyé:", {
            to: params.identifier,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.error("Erreur envoi email de vérification:", {
            error,
            to: params.identifier,
            timestamp: new Date().toISOString()
          });
          throw error;
        }
      },
      generateVerificationToken: async () => {
        try {
          // Utilisation de crypto pour une génération plus sécurisée
          const buffer = await new Promise<Buffer>((resolve, reject) => {
            crypto.randomBytes(3, (err, buf) => {
              if (err) reject(err);
              else resolve(buf);
            });
          });

          // Génère un nombre à 6 chiffres
          const token = String(
            parseInt(buffer.toString("hex"), 16) % 1000000
          ).padStart(6, "0");

          console.log("Token généré:", {
            token,
            timestamp: new Date().toISOString()
          });

          return token;
        } catch (error) {
          console.error("Erreur génération token:", error);
          // Fallback sur la méthode originale en cas d'erreur
          return `${Array(6)
            .fill(() => Math.floor(Math.random() * 10))
            .map((f) => f())
            .join("")}`;
        }
      },
      server,
      from: "noreply@num4.art"
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.isNewUser = user.isNewUser;
        token.profile = user.profile;
        token.image = user.image;
      }

      if (trigger === "update" && session) {
        token.profile = session.user?.profile;
        token.isNewUser = session.user?.isNewUser;
        token.email = session.user?.email;
        token.image = session.user?.image;
      }

      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        const user = session.user;

        user.id = token.sub as string;
        user.isNewUser = Boolean(token.isNewUser);
        user.image = token.image as string;
        user.name = token.name as string;

        const userProfile = await prisma.profile.findFirst({
          where: {
            userId: user.id
          },
          include: {
            artist: {
              include: {
                bankAccount: true
              }
            },
            user: {
              include: {
                admin: true
              }
            },
            orders: true
          }
        });

        user.isNewUser = !userProfile;
        if (userProfile) {
          user.profile = userProfile;
        }

        session.user = user;
      }

      return session;
    }
  },
  pages: {
    newUser: "/me/welcome"
  }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
