import { BsTwitterX } from 'react-icons/bs';
import { BiLogoDiscord, BiLogoYoutube } from 'react-icons/bi';
import Link from 'next/link';
import { default as cn } from '../../lib/cn';
import { OPEN_GRAPH_CONFIG } from '../../config/openGraphConfig';
import { PlatformLogo } from '../brand/PlatformLogo';
import { Button } from '../ui/button';
import { ThemeSelect } from '../theme/ThemeSelect';

export type ComingSoonPageProps = {
	waitlistUrl?: string;
};
export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
	waitlistUrl,
}) => {
	return (
		<div className={cn('flex flex-col max-w-3xl mx-auto px-10 relative')}>
			{/* Centered Logo */}
			<div className={cn('flex justify-center mb-20 mt-24 w-full', 'md:mb-28')}>
				{OPEN_GRAPH_CONFIG.siteBrandLogoDarkMode &&
					OPEN_GRAPH_CONFIG.siteBrandLogoLightMode && (
						<PlatformLogo
							height={380}
							size='lg'
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
			</div>

			{/* Big Coming Soon in Gradient */}
			<div
				className={cn('flex justify-center mb-16 space-x-3 w-full', 'md:mb-20')}
			>
				<div>
					<p
						className={cn(
							'font-semibold leading-[4rem] text-5xl text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-800',
							'md:text-7xl md:leading-[6rem]',
						)}
					>
						Coming Soon
					</p>
				</div>
				<div className={cn('hidden mt-5 text-6xl', 'md:block')}>⏳</div>
			</div>

			{/* Coming Soon Copy Edit */}
			<div className='flex justify-center mb-20 w-full'>
				<p className='font-medium text-2xl text-center leading-9'>
					We're currently working 🧰 hard to bring you something great, and we
					can't wait to share it with you 📅. Our team is putting the finishing
					touches on a new project 🚀 that we think you'll love 😍.
				</p>
			</div>

			{/* CTA */}
			<div className={cn('flex justify-center mb-32 w-full', 'md:mb-36')}>
				<div className='flex flex-col items-center space-y-2'>
					<div>
						<p className='font-light text-lg'>
							Stay tuned for our live updates!
						</p>
					</div>
					{waitlistUrl && (
						<>
							<Link href={waitlistUrl} target='_blank'>
								<Button
									className='!border-[#A8A9AD] flex items-center space-x-1'
									variant='outline'
								>
									<div>
										<p className='text-[#A8A9AD]'>
											Join the Waitlist&nbsp;&nbsp;🕦
										</p>
									</div>
								</Button>
							</Link>
						</>
					)}
				</div>
			</div>

			{/* Footer */}
			<div className='flex justify-center w-full'>
				<div>
					<div className='flex items-center space-x-5'>
						<div>
							<p>Follow Us&nbsp;&nbsp;📣</p>
						</div>
						{OPEN_GRAPH_CONFIG.siteSocialMediaTwitter && (
							<Link
								href={OPEN_GRAPH_CONFIG.siteSocialMediaTwitter}
								target='_blank'
							>
								<BsTwitterX size={18} />
							</Link>
						)}
						{OPEN_GRAPH_CONFIG.siteSocialMediaDiscord && (
							<Link
								href={OPEN_GRAPH_CONFIG.siteSocialMediaDiscord}
								target='_blank'
							>
								<BiLogoDiscord size={24} />
							</Link>
						)}
						{OPEN_GRAPH_CONFIG.siteSocialMediaYouTube && (
							<Link
								href={OPEN_GRAPH_CONFIG.siteSocialMediaYouTube}
								target='_blank'
							>
								<BiLogoYoutube size={20} />
							</Link>
						)}
						<div className='h-5 w-[1px] !bg-[#A8A9AD]' />
						<ThemeSelect />
					</div>
				</div>
			</div>
		</div>
	);
};
