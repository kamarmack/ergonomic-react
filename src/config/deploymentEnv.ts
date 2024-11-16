import { getEnum, EnumMember } from 'ergonomic';

export const DeploymentEnvironmentEnum = getEnum(['production', 'staging']);
export type DeploymentEnvironment = EnumMember<
	typeof DeploymentEnvironmentEnum
>;

if (
	!DeploymentEnvironmentEnum.isMember(
		process.env.NEXT_PUBLIC_DEPLOYMENT_ENVIRONMENT,
	)
) {
	throw new Error(
		`Missing or invalid deployment environment: ${
			process.env.NEXT_PUBLIC_DEPLOYMENT_ENVIRONMENT ?? 'undefined'
		}`,
	);
}

export const DEPLOYMENT_ENV = process.env.NEXT_PUBLIC_DEPLOYMENT_ENVIRONMENT;
