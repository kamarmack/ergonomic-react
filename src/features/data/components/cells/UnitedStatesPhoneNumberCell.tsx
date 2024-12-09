import { YupHelpers } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';
import { getFormattedPhoneNumberFromE164 } from '../../utils/getFormattedPhoneNumberFromE164';

export const UnitedStatesPhoneNumberCell = (
	props: GeneralizedTableCellProps,
): JSX.Element => (
	<DefaultCell
		{...props}
		formatValue={(value: unknown): string => {
			const phoneNumberE164 = value as string;
			return getFormattedPhoneNumberFromE164(phoneNumberE164);
		}}
		isValid={(value: unknown): boolean =>
			YupHelpers.unitedStatesPhoneNumber().isValidSync(value)
		}
	/>
);
