import { FieldValues } from 'react-hook-form';
import { GeneralizedFormFieldProps } from './GeneralizedFormFieldProps';

export type LiteFormFieldProps<TFieldValues extends FieldValues = FieldValues> =
	Pick<
		GeneralizedFormFieldProps<TFieldValues>,
		| 'className'
		| 'control'
		| 'disabled'
		| 'fieldErrors'
		| 'fieldKey'
		| 'fieldSpec'
		| 'hideRequiredIndicator'
		| 'initialFormData'
		| 'language'
		| 'operation'
		| 'setError'
	> & {
		renderTooltipContent?: () => JSX.Element;
	};
