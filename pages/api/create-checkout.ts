import type { NextApiRequest, NextApiResponse } from 'next';

import apiInit from '../../modules/sumup-api-client';
import configs from '../../modules/sumup-configs';

const api = apiInit({ apiUrl: configs.api_url });

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { payment_type } = req.body;
  const { client_id, client_secret } = configs;
  const { access_token } = await api.auth.fetchAccessToken({
    client_id,
    client_secret,
    grant_type: 'client_credentials',
    scope: 'payments',
  });

  const response = await api.checkouts.createCheckout({
    access_token,
    payload: {
      checkout_reference: `checkout-ref-${Math.random()}`,
      merchant_code: configs.merchant_code,
      return_url: `${process.env.VERCEL_URL}/thanks`,
      redirect_url: `${process.env.VERCEL_URL}/thanks`,
      amount: configs.donation_amount,
      payment_type,
      currency: configs.currency,
    },
  });

  res.status(200).json(response);
};
