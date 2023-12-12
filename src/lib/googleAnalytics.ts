import { FIREBASE_CONFIG } from '../config/firebaseConfig';
import { isDomAvailable } from '../utils/isDomAvailable';

declare global {
	interface Window {
		gtag: (
			arg1: 'config' | 'consent' | 'event' | 'get' | 'set',
			...rest: unknown[]
		) => unknown;
	}
}

const gtagConfig = (config: Record<string, string | number>) => {
	if (!isDomAvailable()) return;
	window?.gtag?.('config', FIREBASE_CONFIG.measurementId, config);
};

export type GoogleAnalyticsAction =
	| 'add_payment_info'
	| 'add_shipping_info'
	| 'add_to_cart'
	| 'add_to_wishlist'
	| 'begin_checkout'
	// | 'earn_virtual_currency'
	// | 'exception'
	// | 'generate_lead'
	| 'join_group'
	// | 'level_end'
	// | 'level_start'
	// | 'level_up'
	| 'login'
	| 'page_view'
	// | 'post_score'
	| 'purchase'
	| 'refund'
	| 'remove_from_cart'
	| 'search'
	| 'select_content'
	| 'select_item'
	// | 'select_promotion'
	| 'share'
	| 'sign_up'
	// | 'spend_virtual_currency'
	| 'tutorial_begin'
	| 'tutorial_complete'
	// | 'unlock_achievement'
	| 'view_cart'
	| 'view_item'
	| 'view_item_list'
	// | 'view_promotion'
	| 'view_search_results';

export type GoogleAnalyticsItem = {
	affiliation?: string;
	coupon?: string;
	discount?: number;
	index?: number;
	item_brand?: string;
	item_category?: string;
	item_category2?: string;
	item_category3?: string;
	item_category4?: string;
	item_category5?: string;
	item_id: string;
	item_list_id?: string;
	item_list_name?: string;
	item_name: string;
	item_variant?: string;
	location_id?: string;
	price?: number;
	quantity?: number;
};

export type GoogleAnalyticsActionParams = {
	add_payment_info: {
		coupon?: string;
		currency: string;
		items: GoogleAnalyticsItem[];
		payment_type?: string;
		value: number;
	};
	add_shipping_info: {
		coupon?: string;
		currency: string;
		items: GoogleAnalyticsItem[];
		shipping_tier?: string;
		value: number;
	};
	add_to_cart: {
		currency: string;
		items: GoogleAnalyticsItem[];
		value: number;
	};
	add_to_wishlist: {
		currency: string;
		items: GoogleAnalyticsItem[];
		value: number;
	};
	begin_checkout: {
		coupon?: string;
		currency: string;
		items: GoogleAnalyticsItem[];
		value: number;
	};
	join_group: { group_id?: string };
	login: { method?: string };
	page_view: {
		client_id?: string;
		language?: string;
		page_encoding?: string;
		page_location: string;
		page_title?: string;
		user_agent?: string;
	};
	purchase: {
		coupon?: string;
		currency: string;
		items: GoogleAnalyticsItem[];
		shipping?: number;
		tax?: number;
		transaction_id: string;
		value: number;
	};
	refund: {
		coupon?: string;
		currency: string;
		items?: GoogleAnalyticsItem[];
		shipping?: number;
		tax?: number;
		transaction_id: string;
		value: number;
	};
	remove_from_cart: {
		currency: string;
		items: GoogleAnalyticsItem[];
		value: number;
	};
	search: { search_term: string };
	select_content: { content_id?: string; content_type?: string };
	select_item: {
		items: GoogleAnalyticsItem[];
		item_list_id?: string;
		item_list_name?: string;
	};
	share: { item_id?: string; content_type?: string; method?: string };
	sign_up: { method?: string };
	tutorial_begin: {
		// Empty
	};
	tutorial_complete: {
		// Empty
	};
	view_cart: { currency: string; items: GoogleAnalyticsItem[]; value: number };
	view_item: { currency: string; items: GoogleAnalyticsItem[]; value: number };
	view_item_list: {
		item_list_id?: string;
		item_list_name?: string;
		items: GoogleAnalyticsItem[];
	};
	view_search_results: { search_term?: string };
};

const gtagEvent = (
	action: GoogleAnalyticsAction,
	params: Record<string, string | number | GoogleAnalyticsItem[]>,
) => {
	if (!isDomAvailable()) return;
	window?.gtag?.('event', action, {
		...params,
		send_to: FIREBASE_CONFIG.measurementId,
	});
};

export type GtagConsentParams = {
	ad_personalization?: 'granted' | 'denied';
	ad_storage?: 'granted' | 'denied';
	ad_user_data?: 'granted' | 'denied';
	analytics_storage?: 'granted' | 'denied';
	wait_for_update?: number;
};
const gtagConsent = (params: GtagConsentParams) => {
	if (!isDomAvailable()) return;
	window?.gtag?.('consent', params);
};

const gtagSetGlobalScope = (params: Record<string, string | number>) => {
	if (!isDomAvailable()) return;
	window?.gtag?.('set', params);
};

const gtagSetTargetScope = (
	target: string,
	params: Record<string, string | number>,
) => {
	if (!isDomAvailable()) return;
	window?.gtag?.('set', target, params);
};

const gtagGet = (
	target: string,
	fieldName: string,
	callback: (field: string) => void,
) => {
	if (!isDomAvailable()) return;
	window?.gtag?.('get', target, fieldName, callback);
};

export const googleAnalytics = {
	config: gtagConfig,
	consent: gtagConsent,
	event: {
		addPaymentInfo: (params: GoogleAnalyticsActionParams['add_payment_info']) =>
			gtagEvent('add_payment_info', params),
		addShippingInfo: (
			params: GoogleAnalyticsActionParams['add_shipping_info'],
		) => gtagEvent('add_shipping_info', params),
		addToCart: (params: GoogleAnalyticsActionParams['add_to_cart']) =>
			gtagEvent('add_to_cart', params),
		addToWishlist: (params: GoogleAnalyticsActionParams['add_to_wishlist']) =>
			gtagEvent('add_to_wishlist', params),
		beginCheckout: (params: GoogleAnalyticsActionParams['begin_checkout']) =>
			gtagEvent('begin_checkout', params),
		joinGroup: (params: GoogleAnalyticsActionParams['join_group']) =>
			gtagEvent('join_group', params),
		login: (params: GoogleAnalyticsActionParams['login']) =>
			gtagEvent('login', params),
		pageView: (params: GoogleAnalyticsActionParams['page_view']) =>
			gtagEvent('page_view', params),
		purchase: (params: GoogleAnalyticsActionParams['purchase']) =>
			gtagEvent('purchase', params),
		refund: (params: GoogleAnalyticsActionParams['refund']) =>
			gtagEvent('refund', params),
		removeFromCart: (params: GoogleAnalyticsActionParams['remove_from_cart']) =>
			gtagEvent('remove_from_cart', params),
		search: (params: GoogleAnalyticsActionParams['search']) =>
			gtagEvent('search', params),
		selectContent: (params: GoogleAnalyticsActionParams['select_content']) =>
			gtagEvent('select_content', params),
		selectItem: (params: GoogleAnalyticsActionParams['select_item']) =>
			gtagEvent('select_item', params),
		share: (params: GoogleAnalyticsActionParams['share']) =>
			gtagEvent('share', params),
		signUp: (params: GoogleAnalyticsActionParams['sign_up']) =>
			gtagEvent('sign_up', params),
		tutorialBegin: (params: GoogleAnalyticsActionParams['tutorial_begin']) =>
			gtagEvent('tutorial_begin', params),
		tutorialComplete: (
			params: GoogleAnalyticsActionParams['tutorial_complete'],
		) => gtagEvent('tutorial_complete', params),
		viewCart: (params: GoogleAnalyticsActionParams['view_cart']) =>
			gtagEvent('view_cart', params),
		viewItem: (params: GoogleAnalyticsActionParams['view_item']) =>
			gtagEvent('view_item', params),
		viewItemList: (params: GoogleAnalyticsActionParams['view_item_list']) =>
			gtagEvent('view_item_list', params),
		viewSearchResults: (
			params: GoogleAnalyticsActionParams['view_search_results'],
		) => gtagEvent('view_search_results', params),
	},
	get: gtagGet,
	setGlobalScope: gtagSetGlobalScope,
	setTargetScope: gtagSetTargetScope,
};
