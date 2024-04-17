import { getNSMessages } from "./i18n";
import { getSEOTags } from "./libs/seo";

/**
 * Usage:
 * export const generateMetadata = getGenerateMetadata("PageNameInLocalesDir");
 *
 */

const defaultSeo = {
  title: `Default title`,
  description: `Default descripon`,
  canonicalUrlRelative: ""
};

export async function getMetadataConfig({
  locale,
  page
}: {
  locale: string;
  page: string;
}) {
  try {
    const { seo } = await getNSMessages({ locale, ns: page });
    return {
      title: seo?.title || defaultSeo?.title,
      description: seo?.description || defaultSeo?.description,
      canonicalUrlRelative: seo?.url || defaultSeo?.canonicalUrlRelative
    };
  } catch (e) {
    console.log(e);
    return defaultSeo;
  }
}

export function getGenerateMetadata(page: string) {
  return async ({ params }: any) =>
    getSEOTags(await getMetadataConfig({ locale: params?.locale, page }));
}
