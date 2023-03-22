import axios from 'axios';

type AccessToken = {
  access_token: string;
};

type CheckoutCreated = {
  id: string;
  amount: string;
};

type MerchantPublicId = {
  public_api_key: string;
};

const apiInit = function ({ apiUrl }) {
  return {
    auth: {
      fetchAccessToken: async ({
        client_id,
        client_secret,
        grant_type,
        scope,
      }) => {
        return axios
          .post<AccessToken>(
            `${apiUrl}/token`,
            {
              client_id,
              grant_type,
              client_secret,
              scope,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          )
          .then(({ data }) => data);
      },
    },

    checkouts: {
      createCheckout: async ({ access_token, payload }) => {
        return axios
          .post<CheckoutCreated>(`${apiUrl}/v0.1/checkouts`, payload, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`,
            },
          })
          .then(({ data }) => data);
      },
    },

    merchants: {
      fetchPublicId: async ({ access_token, merchant_code }) => {
        return axios
          .get<MerchantPublicId>(
            `${apiUrl}/v0.1/merchants/${merchant_code}/public-id`,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
              },
            },
          )
          .then(({ data }) => data);
      },
    },
  };
};

export default apiInit;
