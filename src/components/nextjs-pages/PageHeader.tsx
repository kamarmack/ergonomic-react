import Link from 'next/link';
import { BsTwitterX } from 'react-icons/bs';
import { BiLogoDiscord, BiLogoYoutube } from 'react-icons/bi';
import { BaseComponent } from '../../types/BaseComponentTypes';
import { PlatformLogo } from '../../components/brand/PlatformLogo';
import { default as cn } from '../../lib/cn';
import { ThemeSelect } from '../theme/ThemeSelect';
import { openGraphConfig } from '../../config/openGraphConfig';

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
				{openGraphConfig.siteBrandLogoDarkMode &&
					openGraphConfig.siteBrandLogoLightMode && (
						<PlatformLogo
							height={380}
							size='md'
							srcMap={{
								dark: openGraphConfig.siteBrandLogoDarkMode,
								light: openGraphConfig.siteBrandLogoLightMode,
							}}
							width={2048}
						/>
					)}
				{!(
					openGraphConfig.siteBrandLogoDarkMode &&
					openGraphConfig.siteBrandLogoLightMode
				) && (
					<div>
						<p className={cn('text-2xl font-bold', 'lg:text-3xl')}>
							{openGraphConfig.siteName}
						</p>
					</div>
				)}
			</Link>
			<div className='flex items-center space-x-3'>
				{openGraphConfig.siteSocialMediaTwitter && (
					<Link href={openGraphConfig.siteSocialMediaTwitter} target='_blank'>
						<BsTwitterX size={18} />
					</Link>
				)}
				{openGraphConfig.siteSocialMediaDiscord && (
					<Link href={openGraphConfig.siteSocialMediaDiscord} target='_blank'>
						<BiLogoDiscord size={24} />
					</Link>
				)}
				{openGraphConfig.siteSocialMediaYouTube && (
					<Link href={openGraphConfig.siteSocialMediaYouTube} target='_blank'>
						<BiLogoYoutube size={20} />
					</Link>
				)}
				<ThemeSelect />
			</div>
		</div>
	);
};
