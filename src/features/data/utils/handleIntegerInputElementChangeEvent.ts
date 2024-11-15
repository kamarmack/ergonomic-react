export const handleIntegerInputElementChangeEvent =
	(
		setError:
			| React.Dispatch<React.SetStateAction<string>>
			| ((message: string) => void),
	) =>
	(e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;

		// Use a regular expression to allow only integers (both positive and negative)
		const regex = /^-?\d*$/;

		// Check if the value matches the integer pattern
		if (regex.test(inputValue) || !inputValue) {
			e.target.value = inputValue;
			setError('');
		} else {
			setError('Please enter an integer');
		}
	};
