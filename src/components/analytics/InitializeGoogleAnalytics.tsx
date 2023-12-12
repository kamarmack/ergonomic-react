import Script from 'next/script';
import { ENABLE_GOOGLE_ANALYTICS } from '../../config/enableGoogleAnalytics';
import {
	getGoogleTagManagerSource,
	getGoogleAnalyticsInitializationScript,
} from '../../lib/googleAnalytics';

export const InitializeGoogleAnalytics: React.FC = () => {
	if (ENABLE_GOOGLE_ANALYTICS)
		return (
			<>
				<Script strategy='afterInteractive' src={getGoogleTagManagerSource()} />
				<Script id='google-analytics' strategy='afterInteractive'>
					{getGoogleAnalyticsInitializationScript()}
				</Script>
			</>
		);

	return null;
};
