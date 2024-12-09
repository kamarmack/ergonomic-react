import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { getCurrencyUsdStringFromCents } from 'ergonomic';

export const handleUsdFieldKeyUp =
	<TFieldValues extends FieldValues = FieldValues>(params: {
		field: Pick<
			ControllerRenderProps<TFieldValues, Path<TFieldValues>>,
			'onChange'
		>;
		setError:
			| React.Dispatch<React.SetStateAction<string>>
			| ((message: string) => void);
	}) =>
	(e: React.KeyboardEvent<HTMLInputElement>) => {
		let input = e.currentTarget.value;

		// Check if input starts with a dash, indicating a negative value
		const isNegative = input.startsWith('-');

		// Remove all characters except digits, then re-add the dash if needed
		input = input.replace(/[^0-9]/g, '');
		if (isNegative) input = `-${input}`;

		const parsed = parseInt(input);
		if (isNaN(parsed)) {
			params.setError('Please enter only numbers');
			return;
		}
		const formattedValue = getCurrencyUsdStringFromCents(parsed);
		params.field.onChange(formattedValue);
		params.setError('');
	};
