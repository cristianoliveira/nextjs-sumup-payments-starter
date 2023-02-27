import type { NextApiRequest, NextApiResponse } from 'next';

import fetchMerchantPublicId from '../../modules/sumup-merchant-public-id';

export default async (_: NextApiRequest, res: NextApiResponse) => {
  const pubId = await fetchMerchantPublicId();

  res.status(200).json(pubId);
};
