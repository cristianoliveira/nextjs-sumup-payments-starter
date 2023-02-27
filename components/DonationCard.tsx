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
import PaymentWidget from '../components/PaymentWidget';

export function DonationCard({ merchantPubId }) {
  const paymentContainerRef = useRef(null);
  const [issuePaymentRequest, setIssuePaymentRequest] = useState('');

  const [sumUpClient] = useSwiftCheckout(merchantPubId.public_api_key);

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

    paymentRequest.canMakePayment().then((isAvailable: boolean) => {
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
          <PaymentWidget onSuccess={setSuccess} onError={setError} />
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
