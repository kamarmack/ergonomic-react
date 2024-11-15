/**
 * Get formatted phone number from E164 format
 *
 * Notes:
 *
 * 1. This function assumes that the phone number is a US phone number, e.g. +11234567890
 * 2. This function removes the country code from the phone number
 */
export const getFormattedPhoneNumberFromE164 = (phoneNumber: string) => {
	const formattedPhoneNumber = `+${phoneNumber.slice(
		1,
		2,
	)} (${phoneNumber.slice(2, 5)}) ${phoneNumber.slice(
		5,
		8,
	)}-${phoneNumber.slice(8, 12)}`.replace('+1 ', '');
	return formattedPhoneNumber;
};
