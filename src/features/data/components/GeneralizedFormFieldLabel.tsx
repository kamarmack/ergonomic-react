import { isFieldRequired } from 'ergonomic';
import { GoInfo } from 'react-icons/go';
import React from 'react';
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

export const GeneralizedFormFieldLabel: React.FC<
	Pick<GeneralizedFormFieldProps, 'fieldKey' | 'fieldSpec' | 'operation'>
> = ({ fieldKey, fieldSpec, operation }) => {
	const label = getLabel(fieldKey, fieldSpec);
	const required = isFieldRequired({ fieldSpec, operation });
	return (
		<Label className='flex items-center space-x-1'>
			<div>
				<p>
					{label}
					{required && <span className='text-red-700 font-semibold'>*</span>}
				</p>
			</div>
			{(NODE_ENV === 'development' ||
				['true', 'yes', 'TRUE', 'YES', '1'].includes(
					process.env
						.NEXT_PUBLIC_SHOW_SCHEMA_TOOLTIP_ON_GENERALIZED_INPUT_LABELS ?? '',
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
	);
};
