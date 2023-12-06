import { useContext } from 'react';
import { RouteStateContext } from '@/providers/RouteStateProvider';

export const useRouteStateContext = () => {
	const context = useContext(RouteStateContext);
	if (context === undefined) {
		throw new Error('useRouteState must be used within a RouteStateProvider');
	}
	return context;
};
