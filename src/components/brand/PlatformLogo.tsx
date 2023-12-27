import Image from 'next/image';
import { useTheme } from 'next-themes';
import {
	BaseComponent,
	BaseComponentTheme,
} from '../../types/BaseComponentTypes';
import { default as cn } from '../../lib/cn';

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
	const isDarkMode = logoTheme === 'dark' || resolvedTheme === 'dark';
	const logoSize = customLogoSizeClassName || PLATFORM_LOGO_SIZE[size];
	const src =
		srcMap[
			logoTheme === 'auto' ? (resolvedTheme as 'dark' | 'light') : logoTheme
		];

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
