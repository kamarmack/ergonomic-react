import Image from 'next/image';
import { useTheme } from 'next-themes';
import {
	BaseComponent,
	BaseComponentTheme,
} from '../../types/BaseComponentTypes';
import { default as cn } from '../../lib/cn';
import { useIsMounted } from '../../hooks/useIsMounted';

type PlatformLogoFallbackProps = {
	className: string;
	size: string;
};
export const PlatformLogoFallback: React.FC<PlatformLogoFallbackProps> = ({
	className,
	size,
}) => (
	<div
		className={cn(size, className, 'animate-pulse bg-gray-300 rounded-md')}
	/>
);

const PLATFORM_LOGO_SIZE = {
	sm: 'w-16',
	md: 'w-32',
	lg: 'w-40',
	xl: 'w-48',
	'2xl': 'w-56',
	'3xl': 'w-64',
};
export type PlatformLogoProps = BaseComponent & {
	alt?: string;
	customLogoSizeClassName?: string;
	height: number;
	size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
	srcMap: Record<Exclude<BaseComponentTheme, 'auto'>, string>;
	theme?: BaseComponentTheme;
	width: number;
};
export const PlatformLogo: React.FC<PlatformLogoProps> = ({
	alt = 'Platform Logo',
	className = '',
	customLogoSizeClassName = '',
	height,
	size = 'md',
	srcMap,
	theme: logoTheme = 'auto',
	width,
}) => {
	const { resolvedTheme } = useTheme();
	const isMounted = useIsMounted();

	if (!isMounted) {
		return (
			<PlatformLogoFallback
				className={className}
				size={PLATFORM_LOGO_SIZE[size]}
			/>
		);
	}

	const isDarkMode = logoTheme === 'dark' || resolvedTheme === 'dark';
	const logoSize = customLogoSizeClassName || PLATFORM_LOGO_SIZE[size];
	const src =
		srcMap[
			logoTheme === 'auto' ? (resolvedTheme as 'dark' | 'light') : logoTheme
		];

	if (typeof src !== 'string' || !src) {
		return (
			<PlatformLogoFallback
				className={className}
				size={PLATFORM_LOGO_SIZE[size]}
			/>
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
