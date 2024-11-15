import { FieldValues } from 'react-hook-form';
import { GeneralizedFormFieldProps } from '../types/GeneralizedFormFieldProps';
import { AddressField } from './fields/AddressField';
import { BooleanField } from './fields/BooleanField';
import { CurrencyField } from './fields/CurrencyField';
import { DateField } from './fields/DateField';
import { DocumentIDField } from './fields/DocumentIDField';
import { DocumentIDReferenceField } from './fields/DocumentIDReferenceField';
import { DomainField } from './fields/DomainField';
import { DurationField } from './fields/DurationField';
import { EmailAddressField } from './fields/EmailAddressField';
import { FloatingPointNumberField } from './fields/FloatingPointNumberField';
import { IntegerField } from './fields/IntegerField';
import { IntervalField } from './fields/IntervalField';
import { ListField } from './fields/ListField';
import { LongTextField } from './fields/LongTextField';
import { MarkdownTextField } from './fields/MarkdownTextField';
import { PercentageField } from './fields/PercentageField';
import { PhoneNumberField } from './fields/PhoneNumberField';
import { RecurrenceRuleField } from './fields/RecurrenceRuleField';
import { RichTextField } from './fields/RichTextField';
import { SelectManyField } from './fields/SelectManyField';
import { SelectOneField } from './fields/SelectOneField';
import { SensitiveTextField } from './fields/SensitiveTextField';
import { ShortTextField } from './fields/ShortTextField';
import { TimeZoneField } from './fields/TimeZoneField';
import { UrlField } from './fields/UrlField';

export const GeneralizedFormField = <T extends FieldValues = FieldValues>(
	props: GeneralizedFormFieldProps<T>,
): JSX.Element => {
	const { type } = props?.fieldSpec?.meta || {};

	switch (type) {
		case 'address_field':
			return <AddressField {...props} />;

		case 'boolean':
			return <BooleanField {...props} />;

		case 'currency':
			return <CurrencyField {...props} />;

		case 'date':
			return <DateField {...props} />;

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

		case 'id':
			return <DocumentIDField {...props} />;

		case 'id_ref':
		case 'id_refs':
			return <DocumentIDReferenceField {...props} />;

		case 'integer':
			return <IntegerField {...props} />;

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

		case 'phone_number':
			return <PhoneNumberField {...props} />;

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

		case 'url':
			return <UrlField {...props} />;

		default:
			throw new Error(`Unsupported field type: ${type ?? ''}`);
	}
};
