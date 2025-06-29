import { EnumMember, getEnum } from 'ergonomic';

export const BaseLocalStorageStaticKeyEnum = getEnum([
	'firebaseAuthJwt',
	'hasSignedInBefore',
	'language',
	'phoneNumberRegion',
]);
export type BaseLocalStorageStaticKey = EnumMember<
	typeof BaseLocalStorageStaticKeyEnum
>;

/**
 * Use this for keys that are dynamic in nature, meaning they
 * should be scoped to a specific entity, like an API resource.
 * The ID or label for the entity is appended to the end of the key our
 * the `dynamicKeyPath` property.
 *
 * Examples could be something like "sizeSelectedForClothingItem" or "mostRecentPictureViewedForUser"
 */
export const BaseLocalStorageDynamicKeyEnum = getEnum([
	'productHighlightsViewedForReleaseVersion', // e.g. from Driver.js
]);
export type BaseLocalStorageDynamicKey = EnumMember<
	typeof BaseLocalStorageDynamicKeyEnum
>;

export const defaultKeysToRetainOnWipe = [
	'language',
	'phoneNumberRegion',
	'hasSignedInBefore',
];
export function getLocalStorageUtil<
	TCustomLocalStorageStaticKey extends string = never,
	TCustomLocalStorageDynamicKey extends string = never,
>({
	localStorageStaticKeys,
	localStorageDynamicKeys,
	keysToRetainOnWipe = defaultKeysToRetainOnWipe,
}: {
	localStorageStaticKeys: (
		| BaseLocalStorageStaticKey
		| TCustomLocalStorageStaticKey
	)[];
	localStorageDynamicKeys: (
		| BaseLocalStorageDynamicKey
		| TCustomLocalStorageDynamicKey
	)[];
	keysToRetainOnWipe?: string[];
}) {
	type TLocalStorageStaticKey =
		| BaseLocalStorageStaticKey
		| TCustomLocalStorageStaticKey;
	type TLocalStorageDynamicKey =
		| BaseLocalStorageDynamicKey
		| TCustomLocalStorageDynamicKey;
	function saveToLocalStorage<
		TKey extends TLocalStorageStaticKey | TLocalStorageDynamicKey,
	>(
		params: {
			key: TKey;
			dynamicKeyPath?: string;
			value: string;
		} & (
			| { key: TLocalStorageStaticKey; dynamicKeyPath?: never }
			| { key: TLocalStorageDynamicKey; dynamicKeyPath: string }
		),
	): void {
		localStorage.setItem(
			params.key + (params.dynamicKeyPath ? '-' + params.dynamicKeyPath : ''),
			params.value,
		);
	}
	function retrieveFromLocalStorage<
		TKey extends TLocalStorageStaticKey | TLocalStorageDynamicKey,
	>(
		params: {
			key: TKey;
			dynamicKeyPath?: string;
		} & (
			| { key: TLocalStorageStaticKey; dynamicKeyPath?: never }
			| { key: TLocalStorageDynamicKey; dynamicKeyPath: string }
		),
	): string | null {
		return (
			localStorage.getItem(
				params.key + (params.dynamicKeyPath ? '-' + params.dynamicKeyPath : ''),
			) ?? null
		);
	}
	function removeFromLocalStorage<
		TKey extends TLocalStorageStaticKey | TLocalStorageDynamicKey,
	>(
		params: {
			key: TKey;
			dynamicKeyPath?: string;
		} & (
			| { key: TLocalStorageStaticKey; dynamicKeyPath?: never }
			| { key: TLocalStorageDynamicKey; dynamicKeyPath: string }
		),
	): void {
		localStorage.removeItem(
			params.key + (params.dynamicKeyPath ? '-' + params.dynamicKeyPath : ''),
		);
	}
	function dangerouslyWipeLocalStorage() {
		try {
			const allKeys = [];
			for (let i = 0; i < localStorage.length; i++) {
				allKeys.push(localStorage.key(i)!);
			}
			const dynamicKeys = allKeys.filter(function (key) {
				return localStorageDynamicKeys.some(function (dynamicKey) {
					key.startsWith(dynamicKey);
				});
			});
			const keysToRemove = [...localStorageStaticKeys, ...dynamicKeys].filter(
				function (key) {
					return !keysToRetainOnWipe.includes(key);
				},
			);
			keysToRemove.forEach(function (key) {
				localStorage.removeItem(key);
			});
		} catch (_) {
			// swallow
		}
	}

	return {
		saveToLocalStorage,
		retrieveFromLocalStorage,
		removeFromLocalStorage,
		dangerouslyWipeLocalStorage,
	};
}

export const baseLocalStorageUtil = getLocalStorageUtil({
	localStorageStaticKeys: BaseLocalStorageStaticKeyEnum.arr,
	localStorageDynamicKeys: BaseLocalStorageDynamicKeyEnum.arr,
});
