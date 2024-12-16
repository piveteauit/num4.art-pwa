import { Profile, Artist, User } from "@prisma/client"
import type { DefaultSession } from "next-auth"
import type { Provider } from "next-auth/providers"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      profile?: Profile & {
        artist?: Artist
      }
      isNewUser?: boolean
    } & User &
      DefaultSession["user"]
  }

  interface User extends DefaultSession["user"] {
    id: string
    profile?: Profile & {
      artist?: Artist
    }
    isNewUser?: boolean
  }
}

export interface ProviderType {
  id: Provider["id"]
  name: Provider["name"]
  type: Provider["type"]
  style?: any
} 