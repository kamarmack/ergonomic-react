import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { YupHelpers } from 'ergonomic';

export const handleUrlFieldBlur =
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
		if (!value || YupHelpers.webUrl().isValidSync(value)) {
			params.setError('');
		} else {
			params.setError('Please enter a valid URL, e.g. https://example.com');
		}
	};
