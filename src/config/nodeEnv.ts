export type NodeEnvironment = 'development' | 'production' | 'test';

export const NODE_ENV: 'development' | 'production' | 'test' =
	process.env.JEST_WORKER_ID === undefined
		? (process.env.NODE_ENV as NodeEnvironment | undefined) || 'development'
		: 'test';
