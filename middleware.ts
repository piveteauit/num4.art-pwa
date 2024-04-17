import createMiddleware from "next-intl/middleware";
import { localePrefix, locales, pathnames } from "./navigation";

export default createMiddleware({
  locales,
  localePrefix: localePrefix as any,
  defaultLocale: "en",
  pathnames
});

// only applies this middleware to files in the app directory
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"]
};
