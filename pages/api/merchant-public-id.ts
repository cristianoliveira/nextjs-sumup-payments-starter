import type { NextApiRequest, NextApiResponse } from 'next';

import fetchSumupMerchaPublicId from '../../modules/sumup-merchant-public-id';

export default async (_: NextApiRequest, res: NextApiResponse) => {
  const pubId = await fetchSumupMerchaPublicId();

  res.status(200).json(pubId);
};
