import { SITE_ORIGIN } from './originConfig';

export const OPEN_GRAPH_CONFIG = {
	author: process.env.NEXT_PUBLIC_SITE_AUTHOR,
	siteBrandIconDarkMode: process.env.NEXT_PUBLIC_SITE_BRAND_ICON_DARK_MODE,
	siteBrandIconLightMode: process.env.NEXT_PUBLIC_SITE_BRAND_ICON_LIGHT_MODE,
	siteBrandLogoDarkMode: process.env.NEXT_PUBLIC_SITE_BRAND_LOGO_DARK_MODE,
	siteBrandLogoLightMode: process.env.NEXT_PUBLIC_SITE_BRAND_LOGO_LIGHT_MODE,
	siteDescription: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
	siteName: process.env.NEXT_PUBLIC_SITE_NAME,
	siteSocialMediaDiscord: process.env.NEXT_PUBLIC_SITE_SOCIAL_MEDIA_DISCORD,
	siteSocialMediaGitHub: process.env.NEXT_PUBLIC_SITE_SOCIAL_MEDIA_GITHUB,
	siteSocialMediaTwitter: process.env.NEXT_PUBLIC_SITE_SOCIAL_MEDIA_TWITTER,
	siteSocialMediaYouTube: process.env.NEXT_PUBLIC_SITE_SOCIAL_MEDIA_YOUTUBE,
	siteThumbnail: process.env.NEXT_PUBLIC_SITE_THUMBNAIL,
	siteThumbnailAlt: process.env.NEXT_PUBLIC_SITE_THUMBNAIL_ALT,
	siteThumbnailHeight: process.env.NEXT_PUBLIC_SITE_THUMBNAIL_HEIGHT || 630,
	siteThumbnailType: process.env.NEXT_PUBLIC_SITE_THUMBNAIL_TYPE || 'image/png',
	siteThumbnailWidth: process.env.NEXT_PUBLIC_SITE_THUMBNAIL_WIDTH || 1200,
	siteUrl: SITE_ORIGIN,
};
