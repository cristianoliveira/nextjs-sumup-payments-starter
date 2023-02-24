export default {
  createCheckout: ({ paymentType: payment_type }) =>
    fetch('/api/create-checkout', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        payment_type,
      }),
    }).then((r) => r.json()),
};
