export const createCheckoutSession = async (req, res) => {
  const { plan, charityId, contributionPercentage } = req.body;
  
  if (!plan || !charityId) {
    return res.status(400).json({ error: 'Subscription plan and selected Charity ID are required' });
  }

  // Validate constraint: minimum 10%
  if (contributionPercentage < 10) {
    return res.status(400).json({ error: 'Charity contribution must be at least 10%' });
  }

  try {
    // In a production environment, this is where we call Stripe:
    // const session = await stripe.checkout.sessions.create({ ... })
    
    // For this step, we mock a successful response.
    return res.status(200).json({
       message: 'Mock Stripe session created successfully',
       checkoutUrl: '/dashboard', 
       details: { plan, charityId, contributionPercentage }
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: 'Internal server error while creating checkout session' });
  }
};
