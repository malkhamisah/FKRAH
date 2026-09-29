import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES, type Locale } from "./config";
import { getDictionary, type DictKey } from "./dictionaries";

export type { Locale } from "./config";
export type { DictKey } from "./dictionaries";

/** Read the active locale from the cookie (server-side). */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value as Locale | undefined;
  return value && LOCALES.includes(value) ? value : DEFAULT_LOCALE;
}

/** A translation function `t` bound to the active locale. */
export async function getTranslations(): Promise<{
  locale: Locale;
  t: (key: DictKey) => string;
}> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return { locale, t: (key: DictKey) => dict[key] ?? key };
}
