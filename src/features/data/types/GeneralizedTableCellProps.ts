import { GeneralizedFieldSpec } from 'ergonomic';
import { BaseComponent } from '../../../types/BaseComponentTypes';

export type GeneralizedTableCellProps<
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
	TData extends unknown = unknown,
	TResourceName extends string = string,
> = BaseComponent & {
	_object: TResourceName;
	fieldSpec: GeneralizedFieldSpec;
	idPrefixByResourceName: Record<TResourceName, string>;
	originalData: Record<string, unknown>;
	value: TData;
};
