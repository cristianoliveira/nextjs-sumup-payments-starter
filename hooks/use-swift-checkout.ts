import { useEffect, useState } from 'react';
import configs from '../modules/sumup-configs-public';
import injectScript from '../modules/sumup-sdk-injector';

export default (merchantPublicId: string) => {
  const [sumUpClient, setSumUpClient] = useState(null);

  useEffect(() => {
    injectScript({
      scriptSrc: configs.swift_checkout_sdk,
    }).then(({ SumUp }) => {
      setSumUpClient(new SumUp.SwiftCheckout(merchantPublicId));
    });
  }, []);

  return [sumUpClient];
};
