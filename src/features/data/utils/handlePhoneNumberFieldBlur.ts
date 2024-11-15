import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { YupHelpers } from 'ergonomic';

export const handlePhoneNumberFieldBlur =
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

		const value = e.target.value.replace(/[^0-9]/g, '');
		if (YupHelpers.phoneNumber().isValidSync(value)) {
			params.setError('');
		} else {
			params.setError('Please enter a valid phone number, e.g. (555) 555-5555');
		}
	};
