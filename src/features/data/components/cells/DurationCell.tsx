import { Duration } from 'luxon';
import { YupHelpers } from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const DurationCell = (props: GeneralizedTableCellProps): JSX.Element => (
	<DefaultCell
		{...props}
		formatValue={(value: unknown): string => {
			const duration = value as string;
			return Duration.fromISO(duration).toHuman();
		}}
		isValid={(value: unknown): boolean =>
			YupHelpers.duration().isValidSync(value)
		}
	/>
);
