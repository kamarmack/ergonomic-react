if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
	throw new Error('Missing Stripe publishable key');
}

export const STRIPE_CONFIG = {
	publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
};
