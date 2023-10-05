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
                'Content-Type': 'application/json;charset=UTF-8'
              },
            },
          )
          .then(({ data }) => data);
      },
    },

    customers: {
      createCustomer: async ({ access_token, customer_ref }: { access_token: string, customer_ref: string }) => {
        console.log('@@@@@@ access_token: ', access_token);
        const response = await axios.post(`${apiUrl}/v0.1/customers`, {
          customer_id: customer_ref,
          personal_details: {
            address: {
              city: "Berlin",
              country: "DE",
              line1: "Sample street",
              line2: "ap. 5",
              postal_code: "10115",
              state: "Berlin"
            },
            birthdate: "1993-12-31",
            email: "test.customer@cristianoliveira.dev",
            first_name: "Cris",
            last_name: "Doe",
            phone: "+491635559723"
          }
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${access_token}`
          }
        }).then(({ data }) => data);

        return response.id;
      }
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
