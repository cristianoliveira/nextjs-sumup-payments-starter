import { useEffect, useState, useRef } from 'react';
import { NotificationInline, cx, spacing, center } from '@sumup/circuit-ui';

import apiClient from '../modules/app-api-client';
import useSwiftCheckout from '../hooks/use-swift-checkout';

type OnEventHandler = (event: { message: string }) => void;

function SwiftCheckout({
  merchantPubId,
  onSuccess,
  onError,
}: {
  merchantPubId: string;
  onSuccess: OnEventHandler;
  onError: OnEventHandler;
}) {
  const paymentContainerRef = useRef(null);
  const [issuePaymentRequest, setIssuePaymentRequest] = useState('');

  const [sumUpClient] = useSwiftCheckout(merchantPubId);

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

    paymentRequest.canMakePayment().then((isAvailable: boolean) => {
      if (isAvailable) {
        paymentElement.mount({
          paymentMethods: ['apple_pay'],
          container: paymentContainerRef.current,
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
