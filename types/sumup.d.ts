type AccessToken = {
  access_token: string;
};

type CheckoutCreated = {
  id: string;
  amount: string;
};

type PaymentInstrument = {
  token: string;
  active: boolean;

  card: {
    last_4_digits: string;
  };
  mandate: {
    status: string;
  };
};

type MerchantPublicId = {
  merchant_public_key: string;
};
