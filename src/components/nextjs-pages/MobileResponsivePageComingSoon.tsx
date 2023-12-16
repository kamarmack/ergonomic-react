import { GoDesktopDownload } from 'react-icons/go';
import { BaseComponent } from '../../types/BaseComponentTypes';
import cn from '../../lib/cn';
import { PlatformLogo } from '../../components/brand/PlatformLogo';
import { OPEN_GRAPH_CONFIG } from '../../config/openGraphConfig';

export type MobileResponsivePageComingSoonProps = BaseComponent;

export const MobileResponsivePageComingSoon: React.FC<
	MobileResponsivePageComingSoonProps
> = ({ className = '' }) => {
	return (
		<div
			className={cn(
				'flex flex-col justify-center space-y-4 w-screen h-screen p-5',
				className,
			)}
		>
			{OPEN_GRAPH_CONFIG.siteBrandLogoDarkMode &&
				OPEN_GRAPH_CONFIG.siteBrandLogoLightMode && (
					<PlatformLogo
						height={380}
						size='3xl'
						srcMap={{
							dark: OPEN_GRAPH_CONFIG.siteBrandLogoDarkMode,
							light: OPEN_GRAPH_CONFIG.siteBrandLogoLightMode,
						}}
						width={2048}
					/>
				)}
			{!(
				OPEN_GRAPH_CONFIG.siteBrandLogoDarkMode &&
				OPEN_GRAPH_CONFIG.siteBrandLogoLightMode
			) && (
				<div>
					<p className={cn('text-2xl font-bold', 'lg:text-3xl')}>
						{OPEN_GRAPH_CONFIG.siteName}
					</p>
				</div>
			)}
			<div className={cn('flex items-center space-x-0', 'md:space-x-4')}>
				<GoDesktopDownload
					className={cn('text-7xl fill-blue-700 hidden', 'md:block')}
				/>
				<h1 className='text-5xl font-bold'>Let's Reconnect on Desktop</h1>
			</div>
			<p className='text-sm'>
				The mobile and tablet versions of Symmetric are releasing soon
			</p>
		</div>
	);
};
