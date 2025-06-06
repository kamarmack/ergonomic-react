import { FieldValues } from 'react-hook-form';
import { LiteFormFieldProps } from '../types/LiteFormFieldProps';
import { AddressField } from './fields/AddressField';
import { BooleanField } from './fields/BooleanField';
import { DateField } from './fields/DateField';
import { DateTimeField } from './fields/DateTimeField';
import { DomainField } from './fields/DomainField';
import { DurationField } from './fields/DurationField';
import { EmailAddressField } from './fields/EmailAddressField';
import { FloatingPointNumberField } from './fields/FloatingPointNumberField';
import { IntegerField } from './fields/IntegerField';
import { InternationalPhoneNumberField } from './fields/InternationalPhoneNumberField';
import { IntervalField } from './fields/IntervalField';
import { ListField } from './fields/ListField';
import { LongTextField } from './fields/LongTextField';
import { MarkdownTextField } from './fields/MarkdownTextField';
import { PercentageField } from './fields/PercentageField';
import { RecurrenceRuleField } from './fields/RecurrenceRuleField';
import { RichTextField } from './fields/RichTextField';
import { SelectManyField } from './fields/SelectManyField';
import { SelectOneField } from './fields/SelectOneField';
import { SensitiveTextField } from './fields/SensitiveTextField';
import { ShortTextField } from './fields/ShortTextField';
import { TimeZoneField } from './fields/TimeZoneField';
import { UnitedStatesPhoneNumberField } from './fields/UnitedStatesPhoneNumberField';
import { UrlField } from './fields/UrlField';
import { UsdField } from './fields/UsdField';

export const LiteFormField = <T extends FieldValues = FieldValues>(
	props: LiteFormFieldProps<T>,
): JSX.Element => {
	const { type } = props?.fieldSpec?.meta || {};

	switch (type) {
		case 'address_field':
			return <AddressField {...props} />;

		case 'boolean':
			return <BooleanField {...props} />;

		case 'date':
			return <DateField {...props} />;

		case 'date_time':
			return <DateTimeField {...props} />;

		case 'domain':
			return <DomainField {...props} />;

		case 'duration':
			return <DurationField {...props} />;

		case 'email_address':
			return <EmailAddressField {...props} />;

		case 'file':
			return <UrlField {...props} />;

		case 'file_list':
			return <ListField {...props} />;

		case 'floating_point_number':
			return <FloatingPointNumberField {...props} />;

		case 'integer':
			return <IntegerField {...props} />;

		case 'international_phone_number':
			return <InternationalPhoneNumberField {...props} />;

		case 'interval':
			return <IntervalField {...props} />;

		case 'list':
			return <ListField {...props} />;

		case 'long_text':
			return <LongTextField {...props} />;

		case 'markdown_text':
			return <MarkdownTextField {...props} />;

		case 'percentage':
			return <PercentageField {...props} />;

		case 'recurrence_rule':
			return <RecurrenceRuleField {...props} />;

		case 'rich_text':
			return <RichTextField {...props} />;

		case 'select_many':
			return <SelectManyField {...props} />;

		case 'select_one':
			return <SelectOneField {...props} />;

		case 'sensitive_text':
			return <SensitiveTextField {...props} />;

		case 'short_text':
			return <ShortTextField {...props} />;

		case 'time_zone':
			return <TimeZoneField {...props} />;

		case 'united_states_phone_number':
			return <UnitedStatesPhoneNumberField {...props} />;

		case 'url':
			return <UrlField {...props} />;

		case 'usd':
			return <UsdField {...props} />;

		case 'id':
			// return <DocumentIDField {...props} />;
			throw new Error(`Unsupported field type: ${type ?? ''}`);

		case 'foreign_key':
		case 'foreign_keys':
			// return <DocumentIDReferenceField {...props} />;
			throw new Error(`Unsupported field type: ${type ?? ''}`);

		default:
			throw new Error(`Unsupported field type: ${type ?? ''}`);
	}
};
