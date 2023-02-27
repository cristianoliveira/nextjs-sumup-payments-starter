import apiInit from './sumup-api-client';
import configs from './sumup-configs';
import publicConfigs from './sumup-configs-public';

const sumupApi = apiInit({ apiUrl: configs.api_url });

export type MerchantPublicId = {
  public_api_key: string;
};

export default async (): Promise<MerchantPublicId> => {
  // We recommend caching this information on your own backend since once generated
  // it will not change anymore. But it's possible to fetch it on demand.
  if (publicConfigs.merchant_public_key) {
    return {
      public_api_key: publicConfigs.merchant_public_key,
    };
  }

  const { client_id, client_secret, merchant_code } = configs;
  const { access_token } = await sumupApi.auth.fetchAccessToken({
    client_id,
    client_secret,
    grant_type: 'client_credentials',
    scope: 'payments',
  });

  return sumupApi.merchants.fetchPublicId({
    access_token,
    merchant_code,
  });
};
