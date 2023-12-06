declare global {
	interface Window {
		gtag: (arg1: 'config' | 'event', ...rest: unknown[]) => unknown;
	}
}

export const GOOGLE_ANALYTICS_TRACKING_ID =
	process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID || '';
export function pageView(url: string) {
	if (GOOGLE_ANALYTICS_TRACKING_ID) {
		window?.gtag?.('config', GOOGLE_ANALYTICS_TRACKING_ID, {
			page_path: url,
		});
	} else {
		console.log('Google Analytics Tracking ID is not set');
	}
}

type EventParams = {
	action: string;
	category?: string;
	label: string;
	value: number;
};
export function event({ action, category, label, value }: EventParams) {
	window?.gtag?.('event', action, {
		event_category: category,
		event_label: label,
		value,
	});
}
