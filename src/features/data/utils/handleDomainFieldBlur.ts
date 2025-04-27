import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { yupX } from 'ergonomic';

export const handleDomainFieldBlur =
	<TFieldValues extends FieldValues = FieldValues>(params: {
		field: Pick<
			ControllerRenderProps<TFieldValues, Path<TFieldValues>>,
			'onBlur'
		>;
		setError:
			| React.Dispatch<React.SetStateAction<string>>
			| ((message: string) => void);
	}) =>
	(e: React.FocusEvent<HTMLInputElement>) => {
		params.field.onBlur();

		const value = e.target.value;
		if (!value || yupX.domain().isValidSync(value)) {
			params.setError('');
		} else {
			params.setError('Please enter a valid domain, e.g. example.com');
		}
	};
