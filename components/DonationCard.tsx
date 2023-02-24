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

import configs from '../modules/sumup-configs-public';

import injectScript from '../modules/sumup-sdk-injector';
import apiClient from '../modules/app-api-client';

export function DonationCard() {
  const paymentContainerRef = useRef(null);
  const [sumUpClient, setSumUpClient] = useState(null);
  const [issuePaymentRequest, setIssuePaymentRequest] = useState('');

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState<{ message: string }>(null);
  useEffect(() => {
    injectScript({
      scriptSrc: configs.swift_checkout_sdk,
    }).then(({ SumUp }) => {
      setSumUpClient(new SumUp.SwiftCheckout(configs.merchant_public_key));
    });
  }, []);

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
      {issuePaymentRequest && (
        <NotificationInline
          headline="Swift Checkout"
          body={issuePaymentRequest}
          isVisible
          variant="info"
        />
      )}
      <div ref={paymentContainerRef} />

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
