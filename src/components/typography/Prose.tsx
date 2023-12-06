import cn from '@/lib/cn';
import { BaseComponentWithChildren } from '@/types/BaseComponentTypes';

export const Prose: React.FC<BaseComponentWithChildren> = ({ children }) => {
	return (
		<div
			className={cn(
				'max-w-none prose hover:prose-a:opacity-90 prose-code:rounded prose-code:px-1 prose-code:font-medium',
				'prose-a:text-green-600 prose-a:hover:text-green-800',
				'dark:prose-invert dark:prose-a:text-green-400 dark:prose-a:hover:text-green-300',
			)}
		>
			{children}
		</div>
	);
};
