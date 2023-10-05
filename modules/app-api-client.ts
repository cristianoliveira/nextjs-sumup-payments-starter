import axios from 'axios';

export default {
  createCheckout: ({ paymentType: payment_type }: { paymentType?: string }) =>
    axios
      .post<CheckoutCreated>(
        '/api/create-checkout',
        { payment_type },
        {
          headers: {
            'content-type': 'application/json',
          },
        },
      )
      .then(({ data }) => data),

  createSubscription: () =>
    axios
      .post<CheckoutCreated>(
        '/api/create-subscription',
        { },
        {
          headers: {
            'content-type': 'application/json',
          },
        },
      )
      .then(({ data }) => data),

  listPaymentInstruments: ({ onlyActive = false }: { onlyActive: boolean }) =>
    axios
      .get<PaymentInstrument>(
        '/api/payment-instruments',
        { 
          params: { filterActive: onlyActive ? 1 : undefined },
        },
      )
      .then(({ data }) => data),
};
