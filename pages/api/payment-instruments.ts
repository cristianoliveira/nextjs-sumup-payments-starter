import type { NextApiRequest, NextApiResponse } from 'next';

import apiInit from '../../modules/sumup/api-client';
import configs from '../../modules/sumup/configs';

const api = apiInit({ apiUrl: configs.api_url }) as any;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const customerRef = "JOHNPIRIRI";
  const { filterActive } = req.query;

  const { client_id, client_secret } = configs;
  const token = await api.auth
    .fetchAccessToken({
      client_id,
      client_secret,
      grant_type: 'client_credentials',
      scope: 'payment_instruments payments'
    })
    .catch((err: any) => {
      res.status(err.code || 500).json({ ...err });
      return null;
    });

  if (!token) {
    return;
  }

  try {
    const paymentInstruments: PaymentInstrument[] = await api.paymentInstruments.listPaymentInstruments({
      access_token: token.access_token,
      customer_id: customerRef,
    });

    const onlyActive = paymentInstruments.filter((pi) => !filterActive || pi.active);

    const sanitized = onlyActive.map((pi) => ({
      ...pi,
      token: pi.token.substring(0, 4) + '********' + pi.token.substring(pi.token.length - 4),
    }));

    res.status(200).json(sanitized);
  } catch (err: any) {
    res.status(err.code || 500).json({ ...err });
  }
};

