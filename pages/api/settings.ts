import type { NextApiRequest, NextApiResponse } from 'next';

import fetchMerchantPublicId from '../../modules/app-fetch-settings';

export default async (_: NextApiRequest, res: NextApiResponse) => {
  const settings = await fetchMerchantPublicId();
  res.status(200).json(settings);
};
