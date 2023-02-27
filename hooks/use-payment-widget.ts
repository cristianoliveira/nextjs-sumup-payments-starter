import { useEffect, useState } from 'react';
import configs from '../modules/sumup-configs-public';
import injectScript from '../modules/sumup-sdk-injector';

export default () => {
  const [paymentWidget, setPaymentWidget] = useState(null);

  useEffect(() => {
    injectScript({
      scriptSrc: configs.payment_widget_sdK,
    }).then(({ SumUpCard }) => {
      setPaymentWidget(SumUpCard);
    });
  }, []);

  return [paymentWidget];
};
