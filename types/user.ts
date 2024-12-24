import { Account } from "./account";
import { Feedback } from "./feedback";
import { Profile } from "./profile";
import { Session } from "./session";
import { UserPlan } from "@prisma/client";

// export enum UserPlan {
//   FREE = "FREE",
//   PREMIUM = "PREMIUM"
// }

export interface User {
  id: string;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  createdAt?: Date | string;
  locale?: string | null;
  passwordHash?: string | null;
  plan?: UserPlan;
  resendContactId?: string | null;
  stripeCustomerId?: string | null;
  accounts?: Account[];
  Feedback?: Feedback[];
  Profile?: Profile[];
  sessions?: Session[];
} 