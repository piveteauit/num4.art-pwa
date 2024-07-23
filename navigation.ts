import {
  createLocalizedPathnamesNavigation,
  Pathnames
} from "next-intl/navigation";
import i18nextConfig from "@/next-i18n.config";

export const { locales, localePrefix } = i18nextConfig;

export const pathnames = {
  "/": "/",

  "/api/[...params]": "/api/[...params]",

  "/me/signin": "/me/signin",
  "/me/verify": "/me/verify",
  "/me/welcome": "/me/welcome",
  "/me/signout": "/me/signout",
  "/me/signup": "/me/signup",
   

  "/dashboard": {
    en: "/my-account",
    fr: "/mon-compte"
  },

  "/player": {
    en: "/music-player",
    fr: "/lecteur-musique"
  },

  "/library": {
    en: "/my-library",
    fr: "/ma-bibliotheque"
  },

  "/artist": {
    en: "/artist",
    fr: "/artiste"
  },

  "/artist/[artist]": {
    en: "/artist/[artist]",
    fr: "/artiste/[artist]"
  },

  "/see-all": {
    en: "/see-all",
    fr: "/voir-tout"
  }

  // // Dynamic params are supported via square brackets
  // '/news/[articleSlug]-[articleId]': {
  //   en: '/news/[articleSlug]-[articleId]',
  //   de: '/neuigkeiten/[articleSlug]-[articleId]'
  // },

  // Also (optional) catch-all segments are supported
  // '/categories/[...slug]': {
  //   en: '/categories/[...slug]',
  //   de: '/kategorien/[...slug]'
  // }
} satisfies Pathnames<typeof locales>;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation({
    locales,
    localePrefix: localePrefix as any,
    pathnames
  });
