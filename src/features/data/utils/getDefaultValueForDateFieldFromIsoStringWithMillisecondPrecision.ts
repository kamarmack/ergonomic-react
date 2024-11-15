import { DateTime } from 'luxon';

export const getDefaultValueForDateFieldFromIsoStringWithMillisecondPrecision =
	(isoDateString: string) =>
		typeof isoDateString === 'string' && isoDateString
			? // "yyyy-MM-ddThh:mm" followed by optional ":ss" or ":ss.SSS" using local time via Luxon's DateTime.toISO()
			  DateTime.fromISO(isoDateString)
					.toISO({
						suppressMilliseconds: false,
					})
					.slice(0, 16)
			: // Empty string
			  '';
