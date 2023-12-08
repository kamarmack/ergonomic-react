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
				<PlatformLogo
					height={380}
					size='md'
					srcMap={{
						dark: '/img/brand/logo-orange-white__2048x380.png',
						light: '/img/brand/logo-orange-black__2048x380.png',
					}}
					width={2048}
				/>
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
						<BiLogoYoutube size={24} />
					</Link>
				)}
				<ThemeSelect />
			</div>
		</div>
	);
};
