import { getEnum, EnumMember } from 'ergonomic';

export const NodeEnvironmentEnum = getEnum([
	'development',
	'production',
	'test',
]);
export type NodeEnvironment = EnumMember<typeof NodeEnvironmentEnum.obj>;

export const NODE_ENV: 'development' | 'production' | 'test' =
	process.env.JEST_WORKER_ID === undefined
		? (process.env.NODE_ENV as NodeEnvironment | undefined) || 'development'
		: 'test';
