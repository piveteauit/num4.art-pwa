"use client";
import { useParams, useSearchParams } from "next/navigation";
import { usePathname, useRouter, locales } from "@/navigation";
import { setPreferedLocale } from "@/libs/server/user.action";

function LocalePicker({
  id,
}: {
  id?: string;
  locale?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const queryParams = useSearchParams();
  const query: any = {};

  queryParams.forEach((value, key) => {
    query[key] = value;
  });

  return (
    <select
      className="hover:cursor-pointer bg-[transparent]"
      defaultValue={params?.locale}
      onChange={async (evt) => {
        try {
          await setPreferedLocale({ id, locale: evt?.target?.value });
        } catch (e) {
          console.error(e)
        }
        router.replace(
          {
            params: params as any,
            pathname,
            query
          },
          { locale: evt?.target?.value }
        );
      }}
    >
      {locales?.map((l) => (
        <option value={l} key={`locale_${l}`}>
          {l?.toUpperCase()}
        </option>
      ))}
    </select>
  );
}

export default LocalePicker;
