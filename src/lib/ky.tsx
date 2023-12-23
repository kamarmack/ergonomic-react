import { HTTPError } from 'ky-universal';
import { ApiRequestError } from './apiRequestError';

export const handleKyError = async (err: unknown): Promise<ApiRequestError> => {
	let data = {} as unknown;
	let message = 'An unknown error occurred.';
	let status = 500;
	let statusText = 'Internal Server Error';

	if (err instanceof HTTPError) {
		try {
			// Attempt to parse JSON data if available
			data = await err.response.json();
		} catch {
			data = {
				message: err.response.statusText,
			};
		}
		message = `Encountered an error: ${JSON.stringify(data)}`;
		status = err.response.status;
		statusText = err.response.statusText;
	} else if (err instanceof Error) {
		message = err.message;
	}

	return {
		error: {
			data,
			message,
			status,
			statusText,
		},
	};
};
