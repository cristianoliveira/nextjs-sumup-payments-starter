import type { NextApiRequest, NextApiResponse } from 'next';

import apiInit from '../../modules/sumup/api-client';
import configs from '../../modules/sumup/configs';

const api = apiInit({ apiUrl: configs.api_url }) as any;


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const customerRef = "JOHNPIRIRI";

  const { payment_type } = req.body;
  const { client_id, client_secret } = configs;
  const token = await api.auth
    .fetchAccessToken({
      client_id,
      client_secret,
      grant_type: 'client_credentials',
      scope: 'payment_instruments payments'
    })
    .catch((err) => {
      res.status(err.code || 500).json({ ...err });
      return null;
    });

  if (!token) {
    return;
  }

  const customerId = await api.customers.createCustomer({
    access_token: token.access_token,
    customer_ref: customerRef
  }).catch(err => {
    if (err.response.data.error_code === 'CUSTOMER_ALREADY_EXISTS') {
      return customerRef;
    }

    return null;
  });

  if (!customerId) {
    const response = { status: 500, message: "error while creating customer" };
    return res.status(200).json(response);
  }

  try {
    const response = await api.checkouts.createCheckout({
      access_token: token.access_token,
      payload: {
        checkout_reference: `checkout-ref-${Math.random()}`,
        merchant_code: configs.merchant_code,
        return_url: `https://${process.env.VERCEL_URL}/thanks`,
        redirect_url: `https://${process.env.VERCEL_URL}/thanks`,
        amount: configs.donation_amount,
        payment_type,
        currency: configs.currency,

        customer_id: customerRef,
        purpose: "SETUP_RECURRING_PAYMENT",
      },
    });

    res.status(200).json(response);
  } catch (err) {
    res.status(err.code || 500).json({ ...err });
  }
};
