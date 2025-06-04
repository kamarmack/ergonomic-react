import { getUserLocale } from 'get-user-locale';

type SupportedLocale =
	| 'ar'
	| 'de'
	| 'en'
	| 'es'
	| 'fr'
	| 'he'
	| 'hi'
	| 'id'
	| 'it'
	| 'ja'
	| 'ko'
	| 'nl'
	| 'pl'
	| 'pt'
	| 'ru'
	| 'sv'
	| 'tr'
	| 'uk'
	| 'vi'
	| 'zh';

const SUPPORTED_LOCALES = new Set([
	'ar',
	'de',
	'en',
	'es',
	'fr',
	'he',
	'hi',
	'id',
	'it',
	'ja',
	'ko',
	'nl',
	'pl',
	'pt',
	'ru',
	'sv',
	'tr',
	'uk',
	'vi',
	'zh',
]);

export const useLocalizedCopyEdit = <
	T extends Record<SupportedLocale, unknown>,
>(
	copyEdit: T,
): T[SupportedLocale] => {
	const englishCopyEdit = copyEdit.en;
	try {
		const userLocale = getUserLocale({ fallbackLocale: 'en' });
		const userLocaleWithoutRegionCode = (
			(userLocale?.includes('-') ? userLocale?.split('-')?.[0] : userLocale) ??
			'en'
		)?.toLowerCase?.();
		const safeUserLocale = SUPPORTED_LOCALES.has(userLocaleWithoutRegionCode)
			? userLocaleWithoutRegionCode
			: 'en';
		return copyEdit[safeUserLocale as keyof typeof copyEdit];
	} catch (err) {
		return englishCopyEdit;
	}
};
