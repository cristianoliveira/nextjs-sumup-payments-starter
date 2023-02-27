import React, { useEffect, useState, useRef } from 'react';
import { css } from '@emotion/react';

import { SumUpLogo } from '@sumup/icons';
// import styled from '@emotion/styled';
import {
  Card,
  Headline,
  Body,
  NotificationInline,
  cx,
  spacing,
  center,
} from '@sumup/circuit-ui';

import apiClient from '../modules/app-api-client';

import useSwiftCheckout from '../hooks/use-swift-checkout';
import usePaymentWidget from '../hooks/use-payment-widget';

export function DonationCard({ merchantPubId }) {
  const paymentContainerRef = useRef(null);
  const [issuePaymentRequest, setIssuePaymentRequest] = useState('');

  const [sumUpClient] = useSwiftCheckout(merchantPubId.public_api_key);
  const [paymentWidget] = usePaymentWidget();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState<{ message: string }>(null);

  useEffect(() => {
    if (!sumUpClient || !paymentContainerRef.current) {
      return;
    }

    const paymentRequest = sumUpClient.paymentRequest({
      countryCode: 'DE',
      total: {
        label: 'A small contribution',
        amount: { currency: 'EUR', value: '1.00' },
      },
    });

    const paymentElement = sumUpClient
      .elements()
      .onSubmit(async (paymentEvent: any) => {
        try {
          const paymentResponse = await paymentRequest.show(paymentEvent);
          const checkout = await apiClient.createCheckout({
            paymentType: paymentResponse.details.paymentMethod,
          });

          const result = await sumUpClient.processCheckout(
            checkout.id,
            paymentResponse,
          );

          if (result.status === 'PAID') {
            setSuccess({ message: 'Thanks! 🎉' });
          } else {
            setError(new Error('Issue with the payment.'));
          }
        } catch (e) {
          setError(e);
        }
      });

    paymentRequest.canMakePayment().then((isAvailable: any) => {
      if (isAvailable) {
        paymentElement.mount({
          paymentMethods: ['apple_pay'],
          container: paymentContainerRef.current,
        });
      } else {
        setIssuePaymentRequest(
          'No payment is available for this browser. Try to use Safari for ApplePay.',
        );
      }
    });
  }, [sumUpClient, paymentContainerRef.current]);

  useEffect(() => {
    if (!paymentWidget) {
      return;
    }

    apiClient
      .createCheckout({
        paymentType: '',
      })
      .then((checkout) => {
        paymentWidget.mount({
          checkoutId: checkout.id,
          onResponse: function (type: string, body: any) {
            if (type === 'success' && body.status === 'PAID') {
              setSuccess({ message: 'Thanks! 🎉' });
            }

            if (type === 'success' && body.status === 'FAILED') {
              setError(
                new Error(
                  'Something went wrong with the payment. Check your info and try again.',
                ),
              );
            }

            if (type === 'fail') {
              setError(
                new Error(
                  'Something went wrong our system. See logs for details.',
                ),
              );
            }

            console.log('Type', type);
            console.log('Body', body);
          },

          onPaymentMethodsLoad: (payments: any) => {
            return payments.eligible
              .map((p) => p.id)
              .filter((pId) => pId !== 'apple_pay');
          },

          showFooter: false,
        });
      });
  }, [paymentWidget]);

  return (
    <Card>
      <Headline as="h2" css={cx(center, spacing({ bottom: 'mega' }))}>
        {'SumUp online payments'}
      </Headline>
      <Body css={cx(center, spacing({ bottom: 'giga' }))}>
        Buy me a 1 EUR ☕️ 😁
      </Body>
      <Body aria-hidden css={cx(center, spacing({ bottom: 'giga' }))}>
        🔨👩🏽‍💻👨🏼‍💻🚀
      </Body>

      <Body css={cx(center, spacing({ bottom: 'giga' }))}>
        SumUp Swift Checkout ®
      </Body>

      {!success && (
        <div>
          {issuePaymentRequest && (
            <NotificationInline
              headline="Swift Checkout"
              body={issuePaymentRequest}
              isVisible
              variant="info"
            />
          )}
          <Body
            ref={paymentContainerRef}
            css={cx(center, spacing({ bottom: 'giga' }))}
          />

          <Body css={cx(center)}>-- OR --</Body>
          <div id="sumup-card"></div>
        </div>
      )}

      {success && (
        <NotificationInline body={success.message} isVisible variant="info" />
      )}

      {error && (
        <NotificationInline
          body={`Error: ${error.message}`}
          isVisible
          variant="alert"
        />
      )}

      <Body css={cx(center, spacing({ bottom: 'giga' }))}>
        Powered by{' '}
        <SumUpLogo
          css={cx(
            css`
              width: 50px;
            `,
          )}
        />
      </Body>
    </Card>
  );
}
