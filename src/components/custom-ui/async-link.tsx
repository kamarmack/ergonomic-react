import Link, { LinkProps } from 'next/link';
import cn from '../../lib/cn';
import { BaseComponentWithChildren } from '../../types/BaseComponentTypes';

export type AsyncLinkProps = BaseComponentWithChildren &
	LinkProps & {
		isReady?: boolean;
		key?: string;
	};
export const AsyncLink: React.FC<AsyncLinkProps> = ({
	children,
	className = '',
	isReady = true,
	key,
	...props
}) => {
	if (!isReady) {
		return (
			<div className={cn(className)} key={key}>
				{children}
			</div>
		);
	}

	return (
		<Link {...props}>
			<div className={cn(className)}>{children}</div>
		</Link>
	);
};
