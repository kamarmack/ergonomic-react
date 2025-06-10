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
import { getGeneralizedFormFieldLabel as getLabel } from '../utils/getGeneralizedFormFieldLabel';
import { LiteFormFieldProps } from '../types/LiteFormFieldProps';
import {
	baseTranslations,
	useLanguage,
	getLabelSubtitle,
} from '../../../hooks/useLocalization';

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
	const { language } = useLanguage(baseTranslations);
	const label = getLabel(language, fieldKey, fieldSpec);
	const labelSubtitle = getLabelSubtitle(
		language,
		fieldSpec.meta?.label_message_user_text,
	);
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
			{labelSubtitle != null && (
				<div className='font-light mt-0.5 text-gray-500 text-sm'>
					<p>{labelSubtitle}</p>
				</div>
			)}
		</Fragment>
	);
};
