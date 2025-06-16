import { getHumanFriendlyPhoneNumber, yupX } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const UnitedStatesPhoneNumberCell = (
	props: GeneralizedTableCellProps,
): JSX.Element => (
	<DefaultCell
		{...props}
		formatValue={(value: unknown): string => {
			const phoneNumberE164 = value as string;
			return getHumanFriendlyPhoneNumber(phoneNumberE164, 'national');
		}}
		isValid={(value: unknown): boolean =>
			yupX.unitedStatesPhoneNumber().isValidSync(value)
		}
	/>
);
