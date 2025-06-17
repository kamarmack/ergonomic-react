import * as changeCase from 'change-case';
import { GeneralizedFieldSpec } from 'ergonomic';

export const getGeneralizedFormFieldLabel = (
	language: 'en' | 'es',
	fieldKey: string,
	fieldSpec: GeneralizedFieldSpec,
): string =>
	fieldSpec.meta?.localized_label
		? fieldSpec.meta.localized_label[language]
		: fieldSpec.label ??
		  changeCase.sentenceCase((fieldKey ?? '').replace(/^ref_/, ''));

export const getGeneralizedFormFieldPlaceholder = (
	language: 'en' | 'es',
	fieldKey: string,
	fieldSpec: GeneralizedFieldSpec,
	fallback = '',
): string =>
	fieldSpec.meta?.localized_placeholder
		? fieldSpec.meta.localized_placeholder[language]
		: fallback || getGeneralizedFormFieldLabel(language, fieldKey, fieldSpec);
