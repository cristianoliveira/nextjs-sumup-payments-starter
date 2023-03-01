const defaultConfigs = {
  api_url: 'https://api.sumup.com',
  currency: 'EUR',
};

export default {
  api_url: process.env.SUMUP_API_URL || defaultConfigs.api_url,

  // Merchant Information
  // Check: https://me.sumup.com
  merchant_code: process.env.SUMUP_MERCHANT_CODE,
  merchant_email: process.env.SUMUP_MERCHANT_EMAIL,

  // SumUp Api Credentials
  // Check https://developer.sumup.com/protected/oauth-apps/
  client_id: process.env.SUMUP_API_CLIENT_ID,
  client_secret: process.env.SUMUP_API_CLIENT_SECRET,

  // Checkout creation details
  donation_amount: process.env.FIXED_AMOUNT_DONATION,
  currency: process.env.FIXED_AMOUNT_CURRENCY || defaultConfigs.currency,
};
