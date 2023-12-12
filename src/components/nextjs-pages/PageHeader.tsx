import Link from 'next/link';
import { BsTwitterX } from 'react-icons/bs';
import { BiLogoDiscord, BiLogoYoutube } from 'react-icons/bi';
import { BaseComponent } from '../../types/BaseComponentTypes';
import { PlatformLogo } from '../../components/brand/PlatformLogo';
import { default as cn } from '../../lib/cn';
import { ThemeSelect } from '../theme/ThemeSelect';
import { OPEN_GRAPH_CONFIG } from '../../config/openGraphConfig';

export type PageHeaderProps = BaseComponent;
export const PageHeader: React.FC<PageHeaderProps> = ({ className = '' }) => {
	return (
		<div
			className={cn(
				'flex h-[4vh] items-center justify-between px-10 w-full',
				'lg:px-32',
				className,
			)}
		>
			<Link href='/'>
				{OPEN_GRAPH_CONFIG.siteBrandLogoDarkMode &&
					OPEN_GRAPH_CONFIG.siteBrandLogoLightMode && (
						<PlatformLogo
							height={380}
							size='md'
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
			</Link>
			<div className='flex items-center space-x-3'>
				{OPEN_GRAPH_CONFIG.siteSocialMediaTwitter && (
					<Link href={OPEN_GRAPH_CONFIG.siteSocialMediaTwitter} target='_blank'>
						<BsTwitterX size={18} />
					</Link>
				)}
				{OPEN_GRAPH_CONFIG.siteSocialMediaDiscord && (
					<Link href={OPEN_GRAPH_CONFIG.siteSocialMediaDiscord} target='_blank'>
						<BiLogoDiscord size={24} />
					</Link>
				)}
				{OPEN_GRAPH_CONFIG.siteSocialMediaYouTube && (
					<Link href={OPEN_GRAPH_CONFIG.siteSocialMediaYouTube} target='_blank'>
						<BiLogoYoutube size={20} />
					</Link>
				)}
				<ThemeSelect />
			</div>
		</div>
	);
};
