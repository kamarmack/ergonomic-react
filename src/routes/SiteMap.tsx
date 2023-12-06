import { getEnum } from 'ergonomic/dist/typescript-helpers/enum-helpers';

// SSO Web App
export const SsoWebAppRouteStaticIdEnum = getEnum([
	'SSO_WEB_APP-LOGIN',
	'SSO_WEB_APP-REGISTER',
]);
export type SsoWebAppRouteStaticId =
	keyof typeof SsoWebAppRouteStaticIdEnum.obj;

export type SsoWebAppRouteQueryParams = {
	LOGIN: {
		dest: string;
	};
	REGISTER: {
		dest: string;
	};
};

// Web App
export const WebAppRouteStaticIdEnum = getEnum([
	'WEB_APP-ACCOUNT',
	'WEB_APP-BACKENDS',
	'WEB_APP-BACKENDS/CREATE',
	'WEB_APP-BACKENDS/[BACKEND_ID]/DATA',
	'WEB_APP-BACKENDS/[BACKEND_ID]/DOCS',
	'WEB_APP-BACKENDS/[BACKEND_ID]/LOGS',
	'WEB_APP-BACKENDS/[BACKEND_ID]/SCHEMA',
	'WEB_APP-BACKENDS/[BACKEND_ID]/USERS',
	'WEB_APP-BILLING',
]);
export type WebAppRouteStaticId = keyof typeof WebAppRouteStaticIdEnum.obj;

export type WebAppQueryParams = {
	'WEB_APP-ACCOUNT': {
		//
	};
	'WEB_APP-BACKENDS': {
		//
	};
	'WEB_APP-BACKENDS/CREATE': {
		//
	};
	'WEB_APP-BACKENDS/[BACKEND_ID]/DATA': {
		backend_id: string;
	};
	'WEB_APP-BACKENDS/[BACKEND_ID]/DOCS': {
		backend_id: string;
	};
	'WEB_APP-BACKENDS/[BACKEND_ID]/LOGS': {
		backend_id: string;
	};
	'WEB_APP-BACKENDS/[BACKEND_ID]/SCHEMA': {
		backend_id: string;
	};
	'WEB_APP-BACKENDS/[BACKEND_ID]/USERS': {
		backend_id: string;
	};
	'WEB_APP-BILLING': {
		//
	};
};

export const RouteStaticIdEnum = getEnum([
	...SsoWebAppRouteStaticIdEnum.arr,
	...WebAppRouteStaticIdEnum.arr,
]);
export type RouteStaticId = keyof typeof RouteStaticIdEnum.obj;

export const GuestRouteStaticIdEnum = getEnum([
	...SsoWebAppRouteStaticIdEnum.arr,
]);
export type GuestRouteStaticId = keyof typeof GuestRouteStaticIdEnum.obj;

export const AuthenticatedRouteStaticIdEnum = getEnum([
	'WEB_APP-ACCOUNT',
	'WEB_APP-BACKENDS',
	'WEB_APP-BACKENDS/[BACKEND_ID]/DATA',
	'WEB_APP-BACKENDS/[BACKEND_ID]/DOCS',
	'WEB_APP-BACKENDS/[BACKEND_ID]/LOGS',
	'WEB_APP-BACKENDS/[BACKEND_ID]/SCHEMA',
	'WEB_APP-BACKENDS/[BACKEND_ID]/USERS',
	'WEB_APP-BILLING',
]);
export type AuthenticatedRouteStaticId =
	keyof typeof AuthenticatedRouteStaticIdEnum.obj;
