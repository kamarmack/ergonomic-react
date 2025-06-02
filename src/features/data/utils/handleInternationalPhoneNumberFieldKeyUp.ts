import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { AsYouTypeFormatter } from 'google-libphonenumber';
import { Digits } from 'ergonomic';

export const handleInternationalPhoneNumberFieldKeyUp =
	<TFieldValues extends FieldValues = FieldValues>(params: {
		field: Pick<
			ControllerRenderProps<TFieldValues, Path<TFieldValues>>,
			'onChange'
		>;
		setError:
			| React.Dispatch<React.SetStateAction<string>>
			| ((message: string) => void);
		phoneNumberRegion: string; // e.g. 'US', 'SG'
	}) =>
	(e: React.KeyboardEvent<HTMLInputElement>) => {
		const input = e.target as HTMLInputElement;
		const text = input.value.slice();

		/* basic keypad validation */
		const lastChar = text[text.length - 1];
		if (lastChar && !Digits.includes(Number(lastChar))) {
			params.setError('Please type only numbers');
		} else {
			params.setError('');
		}

		/* digits only, max E.164 length minus CC */
		const numeric = text.replace(/\D/g, '').slice(0, 15);

		/* google-libphonenumber incremental formatter */
		const formatter = new AsYouTypeFormatter(
			params.phoneNumberRegion.toUpperCase(),
		);
		let formatted = '';
		for (const d of numeric) formatted = formatter.inputDigit(d);

		params.field.onChange(formatted);
	};
