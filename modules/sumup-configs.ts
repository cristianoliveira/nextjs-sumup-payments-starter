export default {
  api_url: process.env.SUMUP_API_URL,

  // Merchant Information
  merchant_code: process.env.SUMUP_MERCHANT_CODE,
  merchant_email: process.env.SUMUP_MERCHANT_EMAIL,

  // SumUp Api Credentials
  client_id: process.env.SUMUP_API_CLIENT_ID,
  client_secret: process.env.SUMUP_API_CLIENT_SECRET,

  donation_amount: process.env.FIXED_AMOUNT_DONATION,

  currency: 'EUR',
};
