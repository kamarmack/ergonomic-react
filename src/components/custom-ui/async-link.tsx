import Link from 'next/link';
import cn from '../../lib/cn';
import { BaseComponentWithChildren } from '../../types/BaseComponentTypes';

type NextLinkComponentProps = React.ComponentProps<typeof Link>;

export type AsyncLinkProps = BaseComponentWithChildren &
	NextLinkComponentProps & {
		isReady?: boolean;
		key?: string;
		target?: string;
	};
export const AsyncLink: React.FC<AsyncLinkProps> = ({
	children,
	className = '',
	isReady = true,
	key,
	target = '_self',
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
		<Link {...props} target={target}>
			<div className={cn(className)}>{children}</div>
		</Link>
	);
};
