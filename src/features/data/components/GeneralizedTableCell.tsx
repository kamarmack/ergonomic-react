import { GeneralizedTableCellProps } from '../types/GeneralizedTableCellProps';
import { AddressCell } from './cells/AddressCell';
import { BooleanCell } from './cells/BooleanCell';
import { DateCell } from './cells/DateCell';
import { DocumentIDCell } from './cells/DocumentIDCell';
import { DocumentIDReferenceCell } from './cells/DocumentIDReferenceCell';
import { DomainCell } from './cells/DomainCell';
import { DurationCell } from './cells/DurationCell';
import { EmailAddressCell } from './cells/EmailAddressCell';
import { FloatingPointNumberCell } from './cells/FloatingPointNumberCell';
import { IntegerCell } from './cells/IntegerCell';
import { IntervalCell } from './cells/IntervalCell';
import { ListCell } from './cells/ListCell';
import { LongTextCell } from './cells/LongTextCell';
import { MarkdownTextCell } from './cells/MarkdownTextCell';
import { PercentageCell } from './cells/PercentageCell';
import { RecurrenceRuleCell } from './cells/RecurrenceRuleCell';
import { RichTextCell } from './cells/RichTextCell';
import { SelectManyCell } from './cells/SelectManyCell';
import { SelectOneCell } from './cells/SelectOneCell';
import { SensitiveTextCell } from './cells/SensitiveTextCell';
import { ShortTextCell } from './cells/ShortTextCell';
import { TimeZoneCell } from './cells/TimeZoneCell';
import { UrlCell } from './cells/UrlCell';
import { UnitedStatesPhoneNumberCell } from './cells/UnitedStatesPhoneNumberCell';
import { UsdCell } from './cells/UsdCell';

export const GeneralizedTableCell = <
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
	TData extends unknown = unknown,
	TCollection extends string = string,
>(
	props: GeneralizedTableCellProps<TData, TCollection>,
): JSX.Element => {
	const { type } = props?.fieldSpec?.meta || {};

	switch (type) {
		case 'address_field':
			return <AddressCell {...props} />;

		case 'boolean':
			return <BooleanCell {...props} />;

		case 'date':
			return <DateCell {...props} />;

		case 'domain':
			return <DomainCell {...props} />;

		case 'duration':
			return <DurationCell {...props} />;

		case 'email_address':
			return <EmailAddressCell {...props} />;

		case 'file':
			return <UrlCell {...props} />;

		case 'file_list':
			return <ListCell {...props} />;

		case 'floating_point_number':
			return <FloatingPointNumberCell {...props} />;

		case 'id':
			return <DocumentIDCell {...props} />;

		case 'id_ref':
		case 'id_refs':
			return <DocumentIDReferenceCell {...props} />;

		case 'integer':
			return <IntegerCell {...props} />;

		case 'interval':
			return <IntervalCell {...props} />;

		case 'list':
			return <ListCell {...props} />;

		case 'long_text':
			return <LongTextCell {...props} />;

		case 'markdown_text':
			return <MarkdownTextCell {...props} />;

		case 'percentage':
			return <PercentageCell {...props} />;

		case 'recurrence_rule':
			return <RecurrenceRuleCell {...props} />;

		case 'rich_text':
			return <RichTextCell {...props} />;

		case 'select_many':
			return <SelectManyCell {...props} />;

		case 'select_one':
			return <SelectOneCell {...props} />;

		case 'sensitive_text':
			return <SensitiveTextCell {...props} />;

		case 'short_text':
			return <ShortTextCell {...props} />;

		case 'time_zone':
			return <TimeZoneCell {...props} />;

		case 'united_states_phone_number':
			return <UnitedStatesPhoneNumberCell {...props} />;

		case 'url':
			return <UrlCell {...props} />;

		case 'usd':
			return <UsdCell {...props} />;

		default:
			throw new Error(`Unsupported field type: ${type ?? ''}`);
	}
};
