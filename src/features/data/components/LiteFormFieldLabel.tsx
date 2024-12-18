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
	'fieldKey' | 'fieldSpec' | 'operation' | 'renderTooltipContent'
>;
export const LiteFormFieldLabel: React.FC<LiteFormFieldLabelProps> = ({
	fieldKey,
	fieldSpec,
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
					{required && <span className='text-red-700 font-semibold'>*</span>}
				</p>
			</div>
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
