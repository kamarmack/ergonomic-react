export const isDomAvailable = () => {
	try {
		return typeof window !== 'undefined' && !!window.document;
	} catch (_a) {
		return false;
	}
};
