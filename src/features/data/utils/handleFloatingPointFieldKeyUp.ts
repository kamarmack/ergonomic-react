import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

export const handleFloatingPointFieldKeyUp =
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
		const value = e.currentTarget.value.trim();
		const input = value.replace(/[^0-9.-]/g, '');
		const parsed = parseFloat(input);
		if (isNaN(parsed)) {
			params.setError('Please enter a number.');
			return;
		}
		const formattedValue =
			new Intl.NumberFormat('en-US', {
				minimumFractionDigits: value.split('.')[1]?.length || 0,
			}).format(parsed) + (value.endsWith('.') ? '.' : '');
		params.field.onChange(formattedValue);
		params.setError('');
	};
