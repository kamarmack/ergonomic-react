import { getHumanFriendlyPhoneNumber, yupX } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const InternationalPhoneNumberCell = (
	props: GeneralizedTableCellProps,
): JSX.Element => (
	<DefaultCell
		{...props}
		formatValue={(value: unknown): string => {
			const phoneNumberE164 = value as string;
			return getHumanFriendlyPhoneNumber(phoneNumberE164, 'international');
		}}
		isValid={(value: unknown): boolean =>
			yupX.internationalPhoneNumber().isValidSync(value)
		}
	/>
);
