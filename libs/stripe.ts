import Stripe from "stripe";

interface CreateCustomerPortalParams {
  customerId: string;
  returnUrl: string;
}

// This is used to create Customer Portal sessions, so users can manage their subscriptions (payment methods, cancel, etc..)
export const createCustomerPortal = async ({
  customerId,
  returnUrl
}: CreateCustomerPortalParams): Promise<string> => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-04-10" as Stripe.StripeConfig["apiVersion"], // TODO: update this when Stripe updates their API
    typescript: true
  });

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl
  });

  return portalSession.url;
};

// This is used to get the uesr checkout session and populate the data so we get the planId the user subscribed to
export const findCheckoutSession = async (sessionId: string) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-04-10" as Stripe.StripeConfig["apiVersion"],
      typescript: true
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return session;
  } catch (e) {
    console.error(e);
    return null;
  }
};
