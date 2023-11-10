import { useEffect, useState, useRef } from 'react';
import { NotificationInline, cx, spacing, center } from '@sumup/circuit-ui';

import apiClient from '../modules/app-api-client';
import useSwiftCheckout from '../hooks/use-swift-checkout';

type OnEventHandler = (event: { message: string }) => void;

function SwiftCheckout({
  merchantPublicKey,
  donationAmount,
  onSuccess,
  onError,
}: {
  onSuccess: OnEventHandler;
  onError: OnEventHandler;
} & DonationDetails) {
  const paymentContainerRef = useRef(null);
  const [issuePaymentRequest, setIssuePaymentRequest] = useState('');

  const [sumUpClient] = useSwiftCheckout(merchantPublicKey);

  useEffect(() => {
    if (!sumUpClient || !paymentContainerRef.current) {
      return;
    }

    const googlePayMerchantInfo = {
      merchantName: process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_NAME,
      merchantId: process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID,
    }

    const paymentRequest = sumUpClient.paymentRequest({
      countryCode: 'DE',
      total: {
        label: 'A small contribution',
        amount: { currency: 'EUR', value: donationAmount },
      },

      methodData: [
        {
          supportedMethods: 'google_pay',

          data: {
            merchantInfo: googlePayMerchantInfo,
          }
        }
      ],

      shippingOptions: [
        {
          id: 'free',
          label: 'Free shipping',
          amount: { currency: 'EUR', value: '0.00' },
          description: 'Delivered within 5 days.',
        },
        {
          id: 'express',
          label: 'Express shipping',
          amount: { currency: 'EUR', value: '1.00' },
          description: 'Delivered within 2 days.',
        },
        {
          id: 'express pluss',
          label: 'Express pluss shipping',
          amount: { currency: 'EUR', value: '2.00' },
          description: 'Delivered same day.',
        },
      ]
    });

    const paymentElement = sumUpClient
      .elements()
      .onSubmit(async (paymentEvent: unknown) => {
        try {
          const paymentResponse = await paymentRequest.show(paymentEvent);

          const checkout = await apiClient.createCheckout({
            paymentType: paymentResponse.details.paymentMethod,
          });

          const processResult = await sumUpClient.processCheckout(
            checkout.id,
            paymentResponse,
          );

          if (processResult.status === 'PAID') {
            onSuccess({ message: 'Payment completed!' });
          } else {
            onError({
              message:
                'Failed payment attempt. Try again with a different card.',
            });
          }
        } catch (e) {
          onError(e);
        }
      });

    paymentRequest.onShippingOptionsChange((shippingOption: any) => {
        const value = parseFloat(shippingOption.amount.value) + parseFloat(donationAmount);
        return {
          total: {
            label: 'A small contribution + shipping',
            amount: {
              currency: shippingOption.amount.currency,
              value: value.toFixed(2),
            }
          }
        };
    });

    paymentRequest.canMakePayment().then((isAvailable: boolean) => {
      if (isAvailable) {
        paymentRequest.availablePaymentMethods().then((paymentMethods: unknown) => {
          paymentElement.mount({
            paymentMethods,
            container: paymentContainerRef.current,
          });
        });
      } else {
        setIssuePaymentRequest(
          'No payment method is available for this browser. Try using Safari for ApplePay.',
        );
      }
    });
  }, [sumUpClient, paymentContainerRef.current]);

  return (
    <>
      {issuePaymentRequest && (
        <NotificationInline
          headline="Swift Checkout"
          body={issuePaymentRequest}
          isVisible
          variant="info"
        />
      )}
      <div
        ref={paymentContainerRef}
        css={cx(center, spacing({ bottom: 'giga' }))}
      />
    </>
  );
}

export default SwiftCheckout;
