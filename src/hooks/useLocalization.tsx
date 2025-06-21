import { getUserLocale } from 'get-user-locale';
import { EnumMember, getEnum } from 'ergonomic';
import { baseLocalStorageUtil } from '../lib/localStorage';

export const BaseLanguageEnum = getEnum(['en', 'es']);
export type BaseLanguage = EnumMember<typeof BaseLanguageEnum>;
export const baseTranslations = { en: {}, es: {} };

import { useEffect, useState } from 'react';

/**
 * React hook that determines, stores and lets you change the app’s language.
 *
 * Order of precedence on mount:
 * 1. Previously-saved language in localStorage
 * 2. Browser language
 * 3. Fallback to `"en"`
 *
 * The hook keeps the language in component state, persists changes to
 * localStorage and syncs between tabs. A (rarely-fired) `languagechange`
 * event listener is included to capture dynamic browser locale changes
 * and mirror them in localStorage.
 *
 * @example
 * ```tsx
 * function App() {
 *   const { language, changeLanguage } = useLanguage(translations);
 *
 *   return (
 *     <select
 *       value={language}
 *       onChange={function (e) {
 *         changeLanguage(e.target.value as keyof typeof translations);
 *       }}
 *     >
 *       {Object.keys(translations).map(function (lang) {
 *         return (
 *           <option key={lang} value={lang}>
 *             {lang}
 *           </option>
 *         );
 *       })}
 *     </select>
 *   );
 * }
 * ```
 */
export function useLanguage<
	TKey extends string,
	TTranslations extends Record<string, Record<TKey, string>> &
		Record<BaseLanguage, Record<TKey, string>>,
>(
	translations: TTranslations,
): {
	language: keyof TTranslations;
	changeLanguage: (newLanguage: keyof TTranslations) => void;
} {
	// Holds the active language shown to the user.
	const [selectedLanguage, setSelectedLanguage] =
		useState<keyof TTranslations>('en');

	// Decide on initial language once, after the component mounts.
	useEffect(function () {
		const cached = baseLocalStorageUtil.retrieveFromLocalStorage({
			key: 'language',
		});

		if (cached && cached in translations) {
			setSelectedLanguage(cached as keyof TTranslations);
			return;
		}

		const browserLocale = getUserLocale({ fallbackLocale: 'en' });
		const browserLang = (browserLocale.split('-')[0] ||
			'en') as keyof TTranslations;

		if (browserLang in translations) {
			setSelectedLanguage(browserLang);
		}
	}, []);

	/**
	 * Persist the language and update state. In-state updates trigger re-renders
	 * so consumers see the change immediately-no full reload required.
	 */
	function changeLanguage(newLanguage: keyof TTranslations): void {
		if (!(newLanguage in translations)) {
			return; // Silently ignore unsupported keys.
		}

		baseLocalStorageUtil.saveToLocalStorage({
			key: 'language',
			value: String(newLanguage),
		});
		setSelectedLanguage(newLanguage);
	}

	// Keep multiple tabs/windows in sync.
	useEffect(
		function () {
			function storageListener(event: StorageEvent): void {
				if (
					event.key === 'language' &&
					event.newValue &&
					event.newValue in translations
				) {
					setSelectedLanguage(event.newValue as keyof TTranslations);
				}
			}

			window.addEventListener('storage', storageListener);
			return function () {
				window.removeEventListener('storage', storageListener);
			};
		},
		[translations],
	);

	// React to changes in the user's OS/browser language at runtime.
	useEffect(function () {
		if (typeof window === 'undefined' || !('addEventListener' in window)) {
			return;
		}

		function localeListener(): void {
			const browserLocale = getUserLocale({ fallbackLocale: 'en' });
			const browserLang = browserLocale.split('-')[0] || 'en';

			baseLocalStorageUtil.saveToLocalStorage({
				key: 'language',
				value: browserLang,
			});
			// Note: we do **not** override `selectedLanguage`, respecting the user's choice.
		}

		window.addEventListener('languagechange', localeListener);
		return function () {
			window.removeEventListener('languagechange', localeListener);
		};
	}, []);

	return {
		language: selectedLanguage,
		changeLanguage,
	};
}

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

export function getLabelByOption(
	language: 'en' | 'es',
	label_by_enum_option:
		| Record<'en' | 'es', Record<string, string>>
		| Record<string, string>,
): Record<string, string> {
	let labelType: 'single_language' | 'localized' = 'single_language';
	if (
		language in label_by_enum_option &&
		typeof label_by_enum_option[language] === 'object'
	) {
		labelType = 'localized';
	}
	const labelByOption = {
		single_language: label_by_enum_option,
		localized: label_by_enum_option[language] || {},
	}[labelType] as Record<string, string>;
	return labelByOption;
}

export function getLabelSubtitle(
	language: 'en' | 'es',
	label_message_user_text: Record<'en' | 'es', string> | string | undefined,
): string {
	if (label_message_user_text == null) {
		return '';
	}
	if (typeof label_message_user_text === 'string') {
		return label_message_user_text;
	}
	return label_message_user_text[language];
}
