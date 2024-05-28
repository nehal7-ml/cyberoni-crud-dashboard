import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY!);

interface CreateSubscriptionProductDTO {
  name: string;
  description?: string;
  pricingPlans: {
    nickname: string;
    amount: number; // Amount in the smallest currency unit (e.g., cents for USD)
    currency: string;
    interval: "month" | "year";
  }[];
}

export async function createSubscriptionProduct(
  productData: CreateSubscriptionProductDTO,
) {
  try {
    // Create the product
    const product = await stripe.products.create({
      name: productData.name,
      description: productData.description,
    });

    // Create the pricing plans
    const pricingPlans = await Promise.all(
      productData.pricingPlans.map((plan) =>
        stripe.prices.create({
          product: product.id,
          nickname: plan.nickname,
          unit_amount: plan.amount,
          currency: plan.currency,
          recurring: {
            interval: plan.interval,
          },
        }),
      ),
    );

    return { product, pricingPlans };
  } catch (error) {
    console.error("Error creating subscription product:", error);
    throw error;
  }
}

interface UpdateSubscriptionProductDTO {
  id: string;
  name?: string;
  description?: string;
  pricingPlans: {
    id?: string; // Optional, used for existing plans
    nickname: string;
    amount: number; // Amount in the smallest currency unit (e.g., cents for USD)
    currency: string;
    interval: "month" | "year";
  }[];
}
export async function updateSubscriptionProduct(
  productData: UpdateSubscriptionProductDTO,
) {
  try {
    // Fetch the existing product by ID
    const existingProduct = await stripe.products.retrieve(productData.id);

    let product;
    if (existingProduct) {
      // Update the product if it exists
      product = await stripe.products.update(existingProduct.id, {
        name: productData.name,
        description: productData.description,
      });
    } else {
      throw new Error(`Product with ID ${productData.id} does not exist.`);
    }

    // Fetch existing prices for the product
    const existingPrices = await stripe.prices.list({
      product: product.id,
      active: true,
      limit: 100, // Adjust as needed
    });

    const existingPriceMap = new Map(
      existingPrices.data.map((price) => [price.nickname, price]),
    );

    // Collect all price IDs that are in use or being updated
    const usedPriceIds = new Set<string>();

    // Arrays to hold prices that need to be created, updated, or disconnected
    const pricesToCreate: string[] = [];
    const pricesToUpdate: string[] = [];
    const pricesToDisconnect: string[] = [];

    const pricingPlans = await Promise.all(
      productData.pricingPlans.map(async (plan) => {
        const existingPrice = existingPriceMap.get(plan.nickname);

        if (existingPrice) {
          usedPriceIds.add(existingPrice.id);

          if (
            existingPrice.unit_amount !== plan.amount ||
            existingPrice.currency !== plan.currency ||
            existingPrice.recurring?.interval !== plan.interval
          ) {
            // Archive the old price if it exists and needs to be updated
            pricesToUpdate.push(existingPrice.id);
            await stripe.prices.update(existingPrice.id, { active: false });
          } else {
            // Return the existing price if it matches the plan data
            return existingPrice;
          }
        }

        // Create a new price if it doesn't exist or was archived
        const newPrice = await stripe.prices.create({
          product: product.id,
          nickname: plan.nickname,
          unit_amount: plan.amount ,
          currency: plan.currency,
          recurring: {
            interval: plan.interval,
          },
        });

        usedPriceIds.add(newPrice.id);
        pricesToCreate.push(newPrice.id);
        return newPrice;
      }),
    );

    // Identify any prices that need to be disconnected
    existingPrices.data.forEach((price) => {
      if (!usedPriceIds.has(price.id)) {
        pricesToDisconnect.push(price.id);
      }
    });

    // Archive any prices not being used or updated
    await Promise.all(
      pricesToDisconnect.map(async (priceId) => {
        await stripe.prices.update(priceId, { active: false });
      }),
    );

    return {
      product,
      pricingPlans,
      pricesToCreate,
      pricesToUpdate,
      pricesToDisconnect,
    };
  } catch (error) {
    console.error("Error updating subscription product:", error);
    throw error;
  }
}
