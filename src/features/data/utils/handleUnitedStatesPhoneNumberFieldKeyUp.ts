import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { Digits } from 'ergonomic';

export const handleUnitedStatesPhoneNumberFieldKeyUp =
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
		const input = e.target as HTMLInputElement;
		let value = input.value.slice();

		const lastChar = value[value.length - 1];
		if (!Digits.some((char) => `${char}` === lastChar)) {
			params.setError('Please type only numbers');
		} else {
			params.setError('');
		}

		// Remove all non-numeric characters
		const numericValue = value.replace(/\D/g, '');

		// Limit input to 10 digits
		if (numericValue.length > 10) {
			value = numericValue.slice(0, 10);
		} else {
			value = numericValue;
		}

		// Format the number as (XXX) XXX-XXXX
		if (value.length > 6) {
			value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
		} else if (value.length > 3) {
			value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
		} else if (value.length > 0) {
			value = `(${value}`;
		}

		// Set the formatted value back to the input
		params.field.onChange(value);
	};
