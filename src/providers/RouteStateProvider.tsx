import { createContext, useState } from 'react';
import { BaseComponentWithChildren } from '@/types/BaseComponentTypes';

export type RouteState = {
	currentRouteId: string | null;
	currentRouteStaticId: string | null;
};
const INITIAL_ROUTE_STATE: RouteState = {
	currentRouteId: null,
	currentRouteStaticId: null,
};

type RouteStateContextProps = {
	routeState: RouteState;
	setRouteState: React.Dispatch<React.SetStateAction<RouteState>>;
};

export const RouteStateContext = createContext<
	RouteStateContextProps | undefined
>(undefined);

export type RouteStateProviderProps = BaseComponentWithChildren;

export function RouteStateProvider({ children }: RouteStateProviderProps) {
	const [routeState, setRouteState] = useState<RouteState>(INITIAL_ROUTE_STATE);

	return (
		<RouteStateContext.Provider value={{ routeState, setRouteState }}>
			{children}
		</RouteStateContext.Provider>
	);
}
