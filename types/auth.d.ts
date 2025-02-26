import { Profile, Artist, User, Admin, BankAccount } from "@prisma/client";
import type { DefaultSession } from "next-auth";
import type { Provider } from "next-auth/providers";

/**
 * Extension des types NextAuth pour les fonctionnalités spécifiques de l'application
 */
declare module "next-auth/providers/nodemailer" {
  interface SendVerificationRequestParams {
    loginOnly?: boolean;
  }
}
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      profile?: Profile & {
        user: {
          admin?: Admin | null;
        };
        artist?: Artist & {
          bankAccount?: BankAccount;
        };
      };
      isNewUser?: boolean;
    } & User &
      DefaultSession["user"];
  }

  interface User extends DefaultSession["user"] {
    id: string;
    profile?: Profile & {
      user: {
        admin?: Admin | null;
      };
      artist?: Artist & {
        bankAccount?: BankAccount;
      };
    };
    isNewUser?: boolean;
  }
}

export interface ProviderType {
  id: Provider["id"];
  name: Provider["name"];
  type: Provider["type"];
  style?: any;
}
