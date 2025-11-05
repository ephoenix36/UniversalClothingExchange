import Stripe from 'stripe';

if (!process.env.STRIPE_TEST_SECRET_KEY) {
  throw new Error('Missing STRIPE_TEST_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

// Helper to create a Stripe Connect account for a creator
export async function createConnectAccount(email: string, country: string = 'US') {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country,
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
    });
    
    return account;
  } catch (error) {
    console.error('Error creating Stripe Connect account:', error);
    throw error;
  }
}

// Create an account link for onboarding
export async function createAccountLink(accountId: string, returnUrl: string, refreshUrl: string) {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    });
    
    return accountLink;
  } catch (error) {
    console.error('Error creating account link:', error);
    throw error;
  }
}

// Create a payment intent with application fee for marketplace
export async function createPaymentIntent(
  amount: number, // in cents
  currency: string = 'usd',
  connectedAccountId: string,
  applicationFeeAmount: number, // platform commission in cents
) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      application_fee_amount: applicationFeeAmount,
      transfer_data: {
        destination: connectedAccountId,
      },
    });
    
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

// Calculate platform commission
export function calculateCommission(amount: number, commissionRate: number): number {
  return Math.round(amount * (commissionRate / 100));
}

// Format currency for display
export function formatCurrency(cents: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}
