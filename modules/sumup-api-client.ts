const apiInit = function ({ apiUrl }) {
  return {
    auth: {
      fetchAccessToken: async ({
        client_id,
        client_secret,
        grant_type,
        scope,
      }) => {
        return fetch(`${apiUrl}/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id,
            grant_type,
            client_secret,
            scope,
          }),
        }).then((res) => res.json());
      },
    },

    checkouts: {
      createCheckout: async ({ access_token, payload }) => {
        return fetch(`${apiUrl}/v0.1/checkouts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          },

          body: JSON.stringify(payload),
        }).then((res) => res.json());
      },
    },

    merchants: {
      fetchPublicId: async ({ access_token, merchant_code }) => {
        return fetch(`${apiUrl}/v0.1/merchants/${merchant_code}/public-id`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          },
        }).then((res) => res.json());
      },
    },
  };
};

export default apiInit;
