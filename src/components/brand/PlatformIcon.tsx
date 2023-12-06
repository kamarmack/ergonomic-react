import Image from 'next/image';
import { useTheme } from 'next-themes';
import { BaseComponent, BaseComponentTheme } from '@/types/BaseComponentTypes';
import { default as cn } from '@/lib/cn';

const PLATFORM_ICON_SIZE = {
	sm: 'w-6',
	md: 'w-10',
	lg: 'w-20',
};
export type PlatformIconProps = BaseComponent & {
	alt?: string;
	height: number;
	size?: 'sm' | 'md' | 'lg';
	srcMap: Record<Exclude<BaseComponentTheme, 'auto'>, string>;
	theme?: BaseComponentTheme;
	width: number;
};
export const PlatformIcon: React.FC<PlatformIconProps> = ({
	alt = 'Platform Icon',
	className = '',
	height,
	size = 'md',
	srcMap,
	theme: iconTheme = 'auto',
	width,
}) => {
	const { resolvedTheme } = useTheme();
	const isPrimaryMode = iconTheme === 'primary';
	const isDarkMode = iconTheme === 'dark' || resolvedTheme === 'dark';
	const iconSize = PLATFORM_ICON_SIZE[size];
	const src =
		srcMap[
			iconTheme === 'auto' ? (resolvedTheme as 'dark' | 'light') : iconTheme
		];

	if (isPrimaryMode) {
		return (
			<div className={cn(iconSize, className)}>
				<Image
					alt={alt}
					className={cn('object-contain', iconSize)}
					height={height}
					priority
					src={src}
					width={width}
				/>
			</div>
		);
	}

	if (isDarkMode) {
		return (
			<div className={cn(iconSize, className)}>
				<Image
					alt={alt}
					className={cn('object-contain', iconSize)}
					height={height}
					priority
					src={src}
					width={width}
				/>
			</div>
		);
	}

	return (
		<div className={cn(iconSize, className)}>
			<Image
				alt={alt}
				className={cn('object-contain', iconSize)}
				height={height}
				priority
				src={src}
				width={width}
			/>
		</div>
	);
};
