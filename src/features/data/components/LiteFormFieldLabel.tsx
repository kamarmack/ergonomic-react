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
import { getGeneralizedFormFieldLabel as getLabel } from '../utils/getGeneralizedFormFieldLabel';
import { LiteFormFieldProps } from '../types/LiteFormFieldProps';

export type LiteFormFieldLabelProps = Pick<
	LiteFormFieldProps,
	| 'fieldKey'
	| 'fieldSpec'
	| 'hideRequiredIndicator'
	| 'operation'
	| 'renderTooltipContent'
>;
export const LiteFormFieldLabel: React.FC<LiteFormFieldLabelProps> = ({
	fieldKey,
	fieldSpec,
	hideRequiredIndicator = false,
	operation,
	renderTooltipContent,
}) => {
	const label = getLabel(fieldKey, fieldSpec);
	const labelSubtitle = fieldSpec.meta?.label_message_user_text;
	const required = isFieldRequired({ fieldSpec, operation });
	return (
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
			{renderTooltipContent != null && (
				<div>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<button type='button'>
									<GoInfo />
								</button>
							</TooltipTrigger>
							<TooltipContent>{renderTooltipContent()}</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			)}
		</Label>
	);
};
