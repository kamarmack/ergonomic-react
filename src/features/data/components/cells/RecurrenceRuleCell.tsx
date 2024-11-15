import {
	getRecurrenceRuleData,
	getHumanFriendlyRecurrenceRuleString,
	YupHelpers,
} from 'ergonomic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import { DefaultCell } from './DefaultCell';

export const RecurrenceRuleCell = (
	props: GeneralizedTableCellProps,
): JSX.Element => (
	<DefaultCell
		{...props}
		formatValue={(value: unknown): string => {
			const recurrenceRule = value as string;
			const data = getRecurrenceRuleData(recurrenceRule);

			if (data == null) return 'Invalid recurrence rule';

			return getHumanFriendlyRecurrenceRuleString(data);
		}}
		isValid={(value: unknown): boolean =>
			YupHelpers.recurrenceRule().isValidSync(value)
		}
	/>
);
