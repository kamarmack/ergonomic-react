import { DEPLOYMENT_ENV } from './deploymentEnv';

const liveStripePublishableKey =
	process.env.NEXT_PUBLIC_LIVE_STRIPE_PUBLISHABLE_KEY;
const testStripePublishableKey =
	process.env.NEXT_PUBLIC_TEST_STRIPE_PUBLISHABLE_KEY;

const stripePublishableKey = {
	live: liveStripePublishableKey,
	test: testStripePublishableKey,
}[DEPLOYMENT_ENV];

if (!stripePublishableKey) {
	throw new Error('Missing Stripe publishable key');
}

export const STRIPE_CONFIG = {
	publishableKey: stripePublishableKey,
};
