import { isFieldRequired } from 'ergonomic';
import { GoInfo } from 'react-icons/go';
import { Fragment } from 'react';
import { Label } from '../../../components/ui/label';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../../../components/ui/tooltip';
import { NODE_ENV } from '../../../config/nodeEnv';
import { GeneralizedFormFieldProps } from '../types/GeneralizedFormFieldProps';
import { getGeneralizedFormFieldLabel as getLabel } from '../utils/getGeneralizedFormFieldLabel';

export type GeneralizedFormFieldLabelProps = Pick<
	GeneralizedFormFieldProps,
	'fieldKey' | 'fieldSpec' | 'hideRequiredIndicator' | 'operation'
>;
export const GeneralizedFormFieldLabel: React.FC<
	GeneralizedFormFieldLabelProps
> = ({ fieldKey, fieldSpec, hideRequiredIndicator, operation }) => {
	const label = getLabel(fieldKey, fieldSpec);
	const labelSubtitle =
		fieldSpec.meta?.label_message_admin_text ??
		fieldSpec.meta?.label_message_user_text;
	const required = isFieldRequired({ fieldSpec, operation });
	return (
		<Fragment>
			<Label className='flex items-center space-x-1'>
				<div>
					<p>
						{label}
						{required && !hideRequiredIndicator && (
							<span className='text-red-700 font-semibold'>*</span>
						)}
					</p>
				</div>
				{labelSubtitle != null && (
					<div className='text-gray-500 font-light text-sm'>
						<p>{labelSubtitle}</p>
					</div>
				)}
				{(NODE_ENV === 'development' ||
					['true', 'yes', 'TRUE', 'YES', '1'].includes(
						process.env
							.NEXT_PUBLIC_SHOW_SCHEMA_TOOLTIP_ON_GENERALIZED_INPUT_LABELS ??
							'',
					)) && (
					<div>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<button type='button'>
										<GoInfo />
									</button>
								</TooltipTrigger>
								<TooltipContent>
									<div>
										<p className='font-semibold text-sm'>Schema</p>
										<pre className='text-xs font-light text-gray-500 max-w-xs mt-1'>
											{JSON.stringify(
												typeof fieldSpec === 'object' && fieldSpec != null
													? fieldSpec
													: {},
												null,
												'\t',
											)}
										</pre>
									</div>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				)}
			</Label>
			{labelSubtitle != null && (
				<div className='font-light mt-0.5 text-gray-500 text-sm'>
					<p>{labelSubtitle}</p>
				</div>
			)}
		</Fragment>
	);
};
