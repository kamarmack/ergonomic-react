import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

export const handleIntegerFieldKeyUp =
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
		const input = e.currentTarget.value.replace(/(?!^-)[^0-9]/g, '');
		const parsed = parseInt(input);
		if (isNaN(parsed)) {
			params.setError('Please enter a number without any decimal places.');
			return;
		}
		const formattedValue = new Intl.NumberFormat().format(parsed);
		params.field.onChange(formattedValue);
		params.setError('');
	};
