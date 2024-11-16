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

/**
 * The deployment environment of the application.
 *
 * This value is used to determine configuration settings for the application, for example, Firebase configuration settings.
 *
 * See https://firebase.google.com/docs/projects/dev-workflows/overview-environments for an overview of how to manage Firebase configuration settings for pre-production and production environments.
 */
export const DEPLOYMENT_ENV = process.env.NEXT_PUBLIC_DEPLOYMENT_ENVIRONMENT;
