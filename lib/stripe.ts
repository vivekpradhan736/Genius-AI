import Stripe from "stripe";

const stripeInstance = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: "2024-09-30.acacia",
    typescript: true,
});

export { stripeInstance as stripe };
