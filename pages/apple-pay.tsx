/** global ApplePaySession */
import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import {
  Card,
  Headline,
  cx,
  spacing,
  center,
} from '@sumup/circuit-ui';

import { Meta } from '../components/Meta';
import { Logo } from '../components/Logo';
import { Main } from '../components/Main';

import apiClient from '../modules/app-api-client';

const title = 'Thanks!';

const applePaymentRequest = {
  currencyCode: 'EUR',
  countryCode: 'DE',
  merchantCapabilities: ['supports3DS'],
  supportedNetworks: ['masterCard', 'visa'],
  total: {
    label: 'Demo',
    amount: '10.00',
    type: 'final',
  },
};

const ApplePaySession = global.ApplePaySession as any;

const Page: NextPage = () => {
  const [checkout, setCheckout] = useState(null);
  useEffect(() => {
    if (typeof ApplePaySession === 'undefined') {
      return;
    }

    apiClient.createCheckout({
      paymentType: 'apple-pay',
    }).then(setCheckout);

  }, []);

  return (
    <>
      <Meta title={title} path="/" />
      <Main>
        <Logo />
        <Card>
          <Headline as="h2" css={cx(center, spacing({ bottom: 'mega' }))}>
            {'SumUp online payments'}
          </Headline>

          {checkout && (
            <button onClick={() => {
                // applePaymentRequest.total.amount = `${checkout.amount}`;

                const session = new ApplePaySession(6, applePaymentRequest);
                console.log('@@@@@@ session created');

                session.onvalidatemerchant = (event) => {
                  console.log('@@@@@@ event: ', event);
                  const data = {
                    target: event.validationURL,
                    conxtext: 'sponsor.cristianoliveira.com',
                  }

                  fetch(`https://api.sumup.com/v0.1/checkouts/${checkout.id}/apple-pay-session`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                  }).then((response) => {
                    console.log('@@@@@@ response: ', response);
                    session.completeMerchantValidation(response);
                  });
                };

                session.onpaymentauthorized = async (event) => {
                  console.log('@@@@@@ onpaymentauthorized event: ', event);
                };

                console.log('@@@@@@ session begin');
                session.begin();
            }}>Pay with Apple Pay</button>
          )}
        </Card>
        <Link href="https://github.com/cristianoliveira/nextjs-sumup-payments-starter">
          See how it works
        </Link>
      </Main>
    </>
  );
};

export default Page;
