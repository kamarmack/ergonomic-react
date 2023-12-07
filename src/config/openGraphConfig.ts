export const openGraphConfig = {
	author: process.env.NEXT_PUBLIC_SITE_AUTHOR,
	siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
	siteName: process.env.NEXT_PUBLIC_SITE_NAME,
	siteThumbnail: process.env.NEXT_PUBLIC_SITE_THUMBNAIL,
	siteThumbnailAlt: process.env.NEXT_PUBLIC_SITE_THUMBNAIL_ALT,
	siteThumbnailHeight: process.env.NEXT_PUBLIC_SITE_THUMBNAIL_HEIGHT || 630,
	siteThumbnailType: process.env.NEXT_PUBLIC_SITE_THUMBNAIL_TYPE || 'image/png',
	siteThumbnailWidth: process.env.NEXT_PUBLIC_SITE_THUMBNAIL_WIDTH || 1200,
};
