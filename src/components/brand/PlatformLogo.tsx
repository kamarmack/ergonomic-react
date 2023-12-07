import Image from 'next/image';
import { useTheme } from 'next-themes';
import {
	BaseComponent,
	BaseComponentTheme,
} from 'ergonomic-react/src/types/BaseComponentTypes';
import { default as cn } from 'ergonomic-react/src/lib/cn';

const PLATFORM_LOGO_SIZE = {
	sm: 'w-16',
	md: 'w-24',
	lg: 'w-40',
};
export type PlatformLogoProps = BaseComponent & {
	alt?: string;
	height: number;
	size?: 'sm' | 'md' | 'lg';
	srcMap: Record<Exclude<BaseComponentTheme, 'auto'>, string>;
	theme?: BaseComponentTheme;
	width: number;
};
export const PlatformLogo: React.FC<PlatformLogoProps> = ({
	alt = 'Platform Logo',
	className = '',
	height,
	size = 'md',
	srcMap,
	theme: logoTheme = 'auto',
	width,
}) => {
	const { resolvedTheme } = useTheme();
	const isPrimaryMode = logoTheme === 'primary';
	const isDarkMode = logoTheme === 'dark' || resolvedTheme === 'dark';
	const logoSize = PLATFORM_LOGO_SIZE[size];
	const src =
		srcMap[
			logoTheme === 'auto' ? (resolvedTheme as 'dark' | 'light') : logoTheme
		];

	if (isPrimaryMode) {
		return (
			<div className={cn(logoSize, className)}>
				<Image
					alt={alt}
					className={cn('object-contain', logoSize)}
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
			<div className={cn(logoSize, className)}>
				<Image
					alt={alt}
					className={cn('object-contain', logoSize)}
					height={height}
					priority
					src={src}
					width={width}
				/>
			</div>
		);
	}

	return (
		<div className={cn(logoSize, className)}>
			<Image
				alt={alt}
				className={cn('object-contain', logoSize)}
				height={height}
				priority
				src={src}
				width={width}
			/>
		</div>
	);
};
