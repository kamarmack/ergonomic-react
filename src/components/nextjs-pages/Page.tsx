import Head from 'next/head';
import { onlyText } from 'react-children-utilities';
import { useRouter } from 'next/router';
import { BaseComponentWithChildren } from '../../types/BaseComponentTypes';
import { useRouteStateContext } from '../../hooks/useRouteStateContext';
import { useEffect } from 'react';
import { openGraphConfig } from '../../config/openGraphConfig';

export type PageStaticProps = BaseComponentWithChildren & {
	description?: string | React.ReactNode;
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
};
export type PageProps = PageStaticProps & {
	description: string | React.ReactNode;
	routeId: string;
};

export const Page: React.FC<PageProps> = ({
	children,
	description,
	routeId,
	routeStaticId,
	title,
	thumbnailData = {
		thumbnail: openGraphConfig.siteThumbnail,
		thumbnailAlt: openGraphConfig.siteThumbnailAlt,
		thumbnailHeight: openGraphConfig.siteThumbnailHeight,
		thumbnailType: openGraphConfig.siteThumbnailType,
		thumbnailWidth: openGraphConfig.siteThumbnailWidth,
	},
}) => {
	const { asPath } = useRouter();
	const metaTitle = onlyText(title);
	const fullTitle = `${metaTitle} - ${openGraphConfig.siteName ?? ''}`;
	const metaDescription = onlyText(description);
	const metaThumbnail = thumbnailData.thumbnail;
	const ogImage = (metaThumbnail ?? '').startsWith('/')
		? `${openGraphConfig.siteUrl ?? ''}${metaThumbnail ?? ''}`
		: metaThumbnail;
	const metaThumbnailAlt = thumbnailData.thumbnailAlt;
	const metaThumbnailHeight = thumbnailData.thumbnailHeight;
	const metaThumbnailType = thumbnailData.thumbnailType;
	const metaThumbnailWidth = thumbnailData.thumbnailWidth;

	const router = useRouter();
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
	}, [router?.asPath]);

	return (
		<>
			<Head>
				<title>{fullTitle}</title>
				<meta name='description' content={metaDescription} />
				<meta name='author' content={openGraphConfig.author} />
				<meta name='og:description' content={metaDescription} />
				<meta property='og:image' content={ogImage} />
				<meta property='og:image:alt' content={metaThumbnailAlt} />
				<meta property='og:image:height' content={`${metaThumbnailHeight}`} />
				<meta property='og:image:type' content={metaThumbnailType} />
				<meta property='og:image:width' content={`${metaThumbnailWidth}`} />
				<meta property='og:locale' content='en_US' />
				<meta property='og:site_name' content={openGraphConfig.siteName} />
				<meta property='og:title' content={metaTitle} />
				<meta property='og:type' content='website' />
				<meta
					property='og:url'
					content={`${openGraphConfig.siteUrl ?? ''}${asPath}`}
				/>
			</Head>
			{children}
		</>
	);
};
