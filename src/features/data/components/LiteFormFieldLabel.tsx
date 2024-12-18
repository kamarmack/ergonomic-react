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
	| 'labelSubtitle'
	| 'operation'
	| 'renderTooltipContent'
>;
export const LiteFormFieldLabel: React.FC<LiteFormFieldLabelProps> = ({
	fieldKey,
	fieldSpec,
	hideRequiredIndicator = false,
	labelSubtitle,
	operation,
	renderTooltipContent,
}) => {
	const label = getLabel(fieldKey, fieldSpec);
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
				<div className='mt-0.5'>
					<p className='text-gray-500 text-xs'>{labelSubtitle}</p>
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
