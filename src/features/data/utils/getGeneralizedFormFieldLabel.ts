import * as changeCase from 'change-case';
import { GeneralizedFieldSpec } from 'ergonomic';

export const getGeneralizedFormFieldLabel = (
	fieldKey: string,
	fieldSpec: GeneralizedFieldSpec,
) =>
	fieldSpec.label ??
	changeCase.sentenceCase((fieldKey ?? '').replace(/^ref_/, ''));
