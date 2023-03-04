import type { NextApiRequest, NextApiResponse } from 'next';

import fetchSettings from '../../modules/app-fetch-settings';

export default async (_: NextApiRequest, res: NextApiResponse) => {
  const settings = await fetchSettings();
  res.status(200).json(settings);
};
