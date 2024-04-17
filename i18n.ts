import { getRequestConfig } from "next-intl/server";
import i18nextConfig from "@/next-i18n.config";

const { defaultLocale, namespaces } = i18nextConfig;

export async function getNSMessages({
  locale,
  ns
}: {
  locale: string;
  ns: string;
}) {
  try {
    return (await import(`./public/locales/${locale}/${ns}.json`)).default;
  } catch (e) {
    return (await import(`./public/locales/${defaultLocale}/${ns}.json`))
      .default;
  }
}

export default getRequestConfig(async ({ locale }) => {
  const allMessages = await Promise.all(
    namespaces.map((ns) => {
      return new Promise((resolve, reject) => {
        getNSMessages({ locale, ns })
          .then((messages) => resolve({ ns, messages }))
          .catch((e) => {
            console.warn(`Messages not found for : ${ns} in locale: ${locale}`);
            resolve({ ns, messages: {} });
          });
      });
    })
  );

  const messages = allMessages.reduce(
    (acc: any, cur: any) => ({
      ...acc,
      [cur.ns]: cur.messages
    }),
    {}
  );

  return { messages } as any;
});
