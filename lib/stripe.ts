import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    
});

interface CreateSubscriptionProductDTO {
  name: string;
  description?: string;
  pricingPlans: {
    nickname: string;
    amount: number; // Amount in the smallest currency unit (e.g., cents for USD)
    currency: string;
    interval:  'month' | 'year';
  }[];
}

export async function createSubscriptionProduct(productData: CreateSubscriptionProductDTO) {
  try {
    // Create the product
    const product = await stripe.products.create({
      name: productData.name,
      description: productData.description,
    });

    // Create the pricing plans
    const pricingPlans = await Promise.all(
      productData.pricingPlans.map(plan =>
        stripe.prices.create({
          product: product.id,
          nickname: plan.nickname,
          unit_amount: plan.amount,
          currency: plan.currency,
          recurring: {
            interval: plan.interval,
          },
        })
      )
    );

    return { product, pricingPlans };
  } catch (error) {
    console.error('Error creating subscription product:', error);
    throw error;
  }
}
