import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { YupHelpers } from 'ergonomic';

export const handleIntegerFieldBlur =
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

		const value = e.target.value.replace(/[^0-9-]/g, '');
		const num = Number(value);
		if (value === '' || YupHelpers.integer().isValidSync(num)) {
			params.setError('');
		} else {
			params.setError('Please enter a number without any decimal places.');
		}
	};
