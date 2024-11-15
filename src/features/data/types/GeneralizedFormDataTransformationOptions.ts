export type GeneralizedFormDataTransformationOptions = {
	currencyFieldKeys?: string[];
	dateTimeLocalFieldKeys?: string[];
	floatingPointNumberFieldKeys?: string[];
	integerFieldKeys?: string[];
	percentageFieldKeys?: string[];
	phoneNumberFieldKeys?: string[];
};

export const defaultGeneralizedFormDataTransformationOptions: GeneralizedFormDataTransformationOptions =
	{
		currencyFieldKeys: [],
		dateTimeLocalFieldKeys: [],
		floatingPointNumberFieldKeys: [],
		integerFieldKeys: [],
		percentageFieldKeys: [],
		phoneNumberFieldKeys: [],
	};
