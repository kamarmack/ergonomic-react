import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from '../config/stripeConfig';

export const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);
