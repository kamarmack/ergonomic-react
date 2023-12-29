export type BaseComponent = {
	className?: string;
	getErrorComponent?: (props: { errorMessage?: string }) => React.ReactNode;
	getLoadingComponent?: () => React.ReactNode;
	htmlElementId?: string;
	key?: string | number;
};
export type BaseComponentWithChildren = BaseComponent & {
	children?: React.ReactNode;
};

export type BaseComponentTheme = 'auto' | 'dark' | 'light';
