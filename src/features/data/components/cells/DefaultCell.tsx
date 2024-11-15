import 'react-quill/dist/quill.snow.css';
import * as R from 'ramda';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { GeneralizedTableCellProps } from '../../types/GeneralizedTableCellProps';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { default as cn } from '../../../../lib/cn';

export type DefaultCellProps = GeneralizedTableCellProps & {
	formatValue?: (value: unknown) => string;
	isValid: (value: unknown) => boolean;
};
export const DefaultCell = ({
	className = '',
	fieldSpec,
	formatValue = (value: unknown) => (value == null ? 'null' : String(value)),
	isValid,
	value,
}: DefaultCellProps): JSX.Element => {
	const { type } = fieldSpec?.meta || {};
	const isMarkdown = type === 'markdown_text';
	const MarkdownEditor = useMemo(
		() => dynamic(() => import('@uiw/react-md-editor'), { ssr: false }),
		[],
	);
	const isRichText = type === 'rich_text';
	const ReactQuill = useMemo(
		() => dynamic(() => import('react-quill'), { ssr: false }),
		[],
	);

	if (value != null && value !== '' && !isValid(value))
		return (
			<div className={cn('flex items-end text-xs w-fit', className)}>
				<p>Invalid value</p>
			</div>
		);

	if (Array.isArray(value)) {
		const first10 = R.take(10, value);
		const numLeft = value.length - 10;
		const hasMore = numLeft > 0;

		return (
			<div className='flex flex-wrap gap-2 text-xs'>
				{value.length === 0 && <p className='font-light italic'>Empty list</p>}
				{first10.map((item, index) => {
					return (
						<div className='bg-gray-100 p-2 rounded-md w-fit' key={index}>
							<p className='font-semibold text-gray-500 text-sm'>{item}</p>
						</div>
					);
				})}
				{hasMore && (
					<Dialog>
						<DialogTrigger asChild>
							<Button className='!py-0 !px-2' variant='outline'>
								<p className='text-gray-500 text-xs'>Expand</p>
							</Button>
						</DialogTrigger>
						<DialogContent className='max-h-[600px] max-w-[825px] overflow-y-auto'>
							<DialogHeader>
								<DialogTitle>View all</DialogTitle>
							</DialogHeader>
							{value.map((item, index) => {
								return (
									<div className='bg-gray-100 p-2 rounded-md w-fit' key={index}>
										<p className='font-semibold text-gray-500 text-sm'>
											{item}
										</p>
									</div>
								);
							})}
						</DialogContent>
					</Dialog>
				)}
			</div>
		);
	}

	const formattedValue =
		value == null ? 'null' : value === '' ? 'Not set' : formatValue(value);
	const first200 = R.take(200, formattedValue);
	const hasMore = formattedValue.length > 200;
	const italicizedValues: string[] = ['null', 'Not set', 'true', 'false'];

	return (
		<div className={cn('flex items-end text-xs w-fit', className)}>
			<div>
				<p
					className={cn(
						italicizedValues.includes(formattedValue) && 'font-light italic',
					)}
				>
					{type === 'sensitive_text' ? '•••••••••••' : first200}
					{hasMore && '...'}
				</p>
			</div>
			{hasMore && (
				<Dialog>
					<DialogTrigger asChild>
						<Button className='!py-0 !px-2' variant='outline'>
							<p className='text-gray-500 text-xs'>Expand</p>
						</Button>
					</DialogTrigger>
					<DialogContent className='max-h-[600px] max-w-[825px] overflow-y-auto'>
						<DialogHeader>
							<DialogTitle>View all</DialogTitle>
						</DialogHeader>
						{!isMarkdown && !isRichText && <p>{formattedValue}</p>}
						{isMarkdown && (
							<MarkdownEditor
								preview='preview'
								onChange={() => void 0}
								value={formattedValue}
							/>
						)}
						{isRichText && (
							<ReactQuill
								theme='snow'
								value={formattedValue}
								readOnly
								modules={{ toolbar: false }}
							/>
						)}
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
};
