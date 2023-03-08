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
};
