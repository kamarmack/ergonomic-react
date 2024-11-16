import { DEPLOYMENT_ENV } from './deploymentEnv';

const productionStripePublishableKey =
	process.env.NEXT_PUBLIC_PRODUCTION_STRIPE_PUBLISHABLE_KEY;
const stagingStripePublishableKey =
	process.env.NEXT_PUBLIC_STAGING_STRIPE_PUBLISHABLE_KEY;

const stripePublishableKey = {
	production: productionStripePublishableKey,
	staging: stagingStripePublishableKey,
}[DEPLOYMENT_ENV];

if (!stripePublishableKey) {
	throw new Error('Missing Stripe publishable key');
}

export const STRIPE_CONFIG = {
	publishableKey: stripePublishableKey,
};
