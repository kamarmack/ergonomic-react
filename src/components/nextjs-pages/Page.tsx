import Head from 'next/head';
import { useEffect } from 'react';
import { onlyText } from 'react-children-utilities';
import { useRouter } from 'next/router';
import { BaseComponentWithChildren } from '../../types/BaseComponentTypes';
import { useRouteStateContext } from '../../hooks/useRouteStateContext';
import { OPEN_GRAPH_CONFIG } from '../../config/openGraphConfig';
import {
	GoogleAnalyticsActionParams,
	googleAnalytics,
} from '../../lib/googleAnalytics';
import { ENABLE_GOOGLE_ANALYTICS } from '../../config/enableGoogleAnalytics';
import cn from '../../lib/cn';
import { MobileResponsivePageComingSoon } from './MobileResponsivePageComingSoon';
import { baseTranslations, useLanguage } from '../../hooks/useLocalization';

export type PageStaticProps = BaseComponentWithChildren & {
	description?: string | React.ReactNode;
	hideMobileResponsiveVersion?: boolean;
	metaElements?: React.ReactNode;
	routeStaticId: string;
	routeId?: string;
	title: string | React.ReactNode;
	thumbnailData?: {
		thumbnail: string;
		thumbnailAlt: string;
		thumbnailHeight: number;
		thumbnailType: string;
		thumbnailWidth: string;
	};
	language?: 'en' | 'es';
};
export type PageProps = PageStaticProps & {
	routeId: string;
};

export const Page: React.FC<PageProps> = ({
	children,
	description = OPEN_GRAPH_CONFIG.siteDescription,
	hideMobileResponsiveVersion = false,
	metaElements = null,
	routeId,
	routeStaticId,
	title,
	thumbnailData = {
		thumbnail: OPEN_GRAPH_CONFIG.siteThumbnail,
		thumbnailAlt: OPEN_GRAPH_CONFIG.siteThumbnailAlt,
		thumbnailHeight: OPEN_GRAPH_CONFIG.siteThumbnailHeight,
		thumbnailType: OPEN_GRAPH_CONFIG.siteThumbnailType,
		thumbnailWidth: OPEN_GRAPH_CONFIG.siteThumbnailWidth,
	},
	language,
}) => {
	const { language: fallbackLanguage } = useLanguage(baseTranslations);
	const { asPath } = useRouter();
	const metaTitle = onlyText(title);
	const fullTitle = `${metaTitle} - ${OPEN_GRAPH_CONFIG.siteName ?? ''}`;
	const metaDescription = onlyText(description);
	const metaThumbnail = thumbnailData.thumbnail;
	const ogImage = (metaThumbnail ?? '').startsWith('/')
		? `${OPEN_GRAPH_CONFIG.siteUrl ?? ''}${metaThumbnail ?? ''}`
		: metaThumbnail;
	const metaThumbnailAlt = thumbnailData.thumbnailAlt;
	const metaThumbnailHeight = thumbnailData.thumbnailHeight;
	const metaThumbnailType = thumbnailData.thumbnailType;
	const metaThumbnailWidth = thumbnailData.thumbnailWidth;
	const metaUrl = `${OPEN_GRAPH_CONFIG.siteUrl ?? ''}${asPath}`.replace(
		/\/$/,
		'',
	);

	const { setRouteState } = useRouteStateContext();

	useEffect(() => {
		setRouteState(() => ({
			currentRouteId: routeId,
			currentRouteStaticId: routeStaticId,
		}));
		return () => {
			setRouteState(() => ({
				currentRouteId: null,
				currentRouteStaticId: null,
			}));
		};
	}, [asPath]);

	useEffect(() => {
		if (!ENABLE_GOOGLE_ANALYTICS) return;

		const pageViewParams: GoogleAnalyticsActionParams['page_view'] = {
			page_location: metaUrl,
			page_title: metaTitle,
		};

		googleAnalytics.event.pageView(pageViewParams);
	}, [ENABLE_GOOGLE_ANALYTICS, metaUrl, metaTitle]);

	return (
		<>
			<Head>
				<title>{fullTitle}</title>
				<meta charSet='UTF-8' />
				<meta
					content='width=device-width, initial-scale=1.0, minimum-scale=1.0, viewport-fit=cover'
					name='viewport'
				/>
				<meta name='description' content={metaDescription} />
				<meta name='author' content={OPEN_GRAPH_CONFIG.author} />
				<meta name='og:description' content={metaDescription} />
				<meta property='og:image' content={ogImage} />
				<meta property='og:image:alt' content={metaThumbnailAlt} />
				<meta property='og:image:height' content={`${metaThumbnailHeight}`} />
				<meta property='og:image:type' content={metaThumbnailType} />
				<meta property='og:image:width' content={`${metaThumbnailWidth}`} />
				<meta
					property='og:locale'
					content={{ en: 'en_US', es: 'es_ES' }[language || fallbackLanguage]}
				/>
				<meta property='og:site_name' content={OPEN_GRAPH_CONFIG.siteName} />
				<meta property='og:title' content={metaTitle} />
				<meta property='og:type' content='website' />
				<meta property='og:url' content={metaUrl} />
				{metaElements}
			</Head>
			<MobileResponsivePageComingSoon
				className={cn(
					hideMobileResponsiveVersion ? 'block xl:hidden' : 'hidden',
				)}
			/>
			<div
				className={cn(
					hideMobileResponsiveVersion ? 'hidden xl:block' : 'block',
				)}
			>
				{children}
			</div>
		</>
	);
};
