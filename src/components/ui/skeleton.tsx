import { default as cn } from 'ergonomic-react/src/lib/cn';

function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn('animate-pulse rounded-md bg-muted', className)}
			{...props}
		/>
	);
}

export { Skeleton };
