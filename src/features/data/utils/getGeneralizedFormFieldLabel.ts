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
