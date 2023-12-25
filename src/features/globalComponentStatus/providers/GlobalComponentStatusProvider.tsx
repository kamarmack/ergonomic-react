import { createContext, useEffect, useState } from 'react';
typeof useEffect;

export type GlobalComponentStatusProviderState = {
	isReady: boolean;
	setStatus: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
	status: Record<string, unknown>;
};

const defaultSetStatus: GlobalComponentStatusProviderState['setStatus'] =
	() => {
		throw new Error(
			'GlobalComponentStatusProvider: setStatus was called before the provider was ready.',
		);
	};
const defaultStatus: GlobalComponentStatusProviderState['status'] = {};

export const GlobalComponentStatusContext =
	createContext<GlobalComponentStatusProviderState>({
		isReady: false,
		setStatus: defaultSetStatus,
		status: defaultStatus,
	});

export const GlobalComponentStatusProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [status, setStatus] = useState(defaultStatus);

	return (
		<GlobalComponentStatusContext.Provider
			value={{
				isReady: typeof setStatus !== 'undefined',
				setStatus,
				status,
			}}
		>
			{children}
		</GlobalComponentStatusContext.Provider>
	);
};
