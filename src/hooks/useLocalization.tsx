import { getUserLocale } from 'get-user-locale';
import { EnumMember, getEnum } from 'ergonomic';
import { baseLocalStorageUtil } from '../lib/localStorage';
import { isDomAvailable } from '../utils/isDomAvailable';

export const BaseLanguageEnum = getEnum(['en', 'es']);
export type BaseLanguage = EnumMember<typeof BaseLanguageEnum>;
export const baseTranslations = { en: {}, es: {} };

export const useLanguage = <
	TKey extends string,
	TTranslations extends Record<string, Record<TKey, string>> & // allow any lang
		Record<BaseLanguage, Record<TKey, string>>, // but require en + es
>(
	translations: TTranslations,
): { language: keyof TTranslations } => {
	try {
		// 1. get previously saved language, if any
		const cachedLanguage = isDomAvailable()
			? baseLocalStorageUtil.retrieveFromLocalStorage({ key: 'language' })
			: null;

		// 2. get language from the browser
		const browserLocale = getUserLocale({ fallbackLocale: 'en' });
		const browserLanguage = browserLocale.split('-')[0] ?? 'en';

		// 3. language selection: stored > browser > 'en'
		const language: keyof typeof translations =
			cachedLanguage && cachedLanguage in translations
				? cachedLanguage
				: browserLanguage in translations
				? browserLanguage
				: 'en';

		return { language };
	} catch (_) {
		return { language: 'en' };
	}
};

/**
 * Hook to get localized copy edit
 *
 * @param translations - A record mapping languages to their translations for each entry.
 * @returns A record of translations for the current language, falling back to English if necessary.
 *
 * @example
 * ```tsx
 * const translations = {
 * 	en: {
 * 		greeting: 'Hello',
 * 		farewell: 'Goodbye',
 * 	},
 * 	es: {
 * 		greeting: 'Hola',
 * 		farewell: 'Adiós',
 * 	},
 * } as const;
 * const { greeting } = useLocalization(translations);
 * return (
 * 	<div>
 * 		<p>{greeting}</p>
 * 	</div>
 * );
 *```
 */
export const useLocalization = <
	TKey extends string,
	TTranslations extends Record<string, Record<TKey, string>> & // allow any lang
		Record<BaseLanguage, Record<TKey, string>>, // but require en + es
>(
	translations: TTranslations,
): Record<TKey, string> => {
	const englishTranslations = translations.en;
	try {
		const { language } = useLanguage(translations);
		return translations[language];
	} catch (_) {
		return englishTranslations;
	}
};
