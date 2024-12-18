import { FieldValues } from 'react-hook-form';
import { GeneralizedFormFieldProps } from './GeneralizedFormFieldProps';

export type LiteFormFieldProps<TFieldValues extends FieldValues = FieldValues> =
	Pick<
		GeneralizedFormFieldProps<TFieldValues>,
		| 'className'
		| 'control'
		| 'fieldErrors'
		| 'fieldKey'
		| 'fieldSpec'
		| 'hideRequiredIndicator'
		| 'initialFormData'
		| 'isSubmitting'
		| 'operation'
		| 'setError'
	> & {
		renderTooltipContent?: () => JSX.Element;
	};
