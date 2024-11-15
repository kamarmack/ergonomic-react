import { GeneralizedFieldSpec } from 'ergonomic';
import { BaseComponent } from '../../../types/BaseComponentTypes';

export type GeneralizedTableCellProps<
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
	TData extends unknown = unknown,
	TCollection extends string = string,
> = BaseComponent & {
	_object: TCollection;
	fieldSpec: GeneralizedFieldSpec;
	idPrefixByCollection: Record<TCollection, string>;
	originalData: Record<string, unknown>;
	value: TData;
};
