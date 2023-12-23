/**
 * ApiRequestError
 *
 * An error that is thrown when an API request fails.
 *
 * @property error The error object returned by the API
 * @property error.data The data returned by the API
 * @property error.message The error message returned by the API
 * @property error.status The status code returned by the API
 * @property error.statusText The status text returned by the API
 *
 * @example
 * {
 * 	error: {
 * 		data: {
 * 				'username': [
 * 					'This field may not be blank.'
 * 				],
 * 		},
 * 		message: 'Bad Request',
 * 		status: 400,
 * 		statusText: 'Bad Request'
 * 	}
 * }
 */
export type ApiRequestError = {
	error: {
		data: unknown;
		message: string;
		status: number;
		statusText: string;
	};
};

/**
 * Checks if an error is an ApiRequestError
 * @param err The error to check
 * @returns true if err is an ApiRequestError
 */
export const isApiRequestError = (err: unknown): err is ApiRequestError => {
	return (
		typeof err === 'object' &&
		err !== null &&
		'error' in err &&
		typeof (err as ApiRequestError).error === 'object' &&
		(err as ApiRequestError).error !== null &&
		'data' in (err as ApiRequestError).error &&
		'message' in (err as ApiRequestError).error &&
		'status' in (err as ApiRequestError).error &&
		'statusText' in (err as ApiRequestError).error
	);
};
