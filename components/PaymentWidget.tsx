import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { Spinner, cx, spacing, center } from '@sumup/circuit-ui';

import usePaymentWidget from '../hooks/use-payment-widget';
import apiClient from '../modules/app-api-client';

type OnEventHandler = (event: { message: string }) => void;

function PaymentWidget({
  onSuccess,
  onError,
}: {
  onSuccess: OnEventHandler;
  onError: OnEventHandler;
}) {
  const [isReady, setIsReady] = useState(false);
  const [paymentWidget] = usePaymentWidget();

  useEffect(() => {
    if (!paymentWidget) {
      return;
    }

    apiClient
      .createCheckout({
        paymentType: '',
      })
      .then((checkout: { id: string }) => {
        paymentWidget.mount({
          onLoad: () => setIsReady(true),
          checkoutId: checkout.id,

          onPaymentMethodsLoad: (payments: { eligible: { id: string }[] }) => {
            return payments.eligible
              .map((p) => p.id)
              .filter((pId) => pId !== 'apple_pay');
          },

          onResponse: function (type: string, body: { status: string }) {
            if (type === 'success' && body.status === 'PAID') {
              onSuccess({ message: 'Thanks! 🎉' });
            }

            if (type === 'success' && body.status === 'FAILED') {
              onError({
                message:
                  'Something went wrong with the payment. Check your info and try again.',
              });
            }

            if (type === 'fail') {
              onError({
                message:
                  'Something went wrong with our system. See console logs for details.',
              });
            }

            console.log('Type', type);
            console.log('Body', body);
          },

          showFooter: false,
        });
      });
  }, [paymentWidget]);

  return (
    <>
      {!isReady && (
        <div css={cx(center, spacing({ top: 'giga', bottom: 'giga' }))}>
          <Spinner
            css={(theme: any) => css`
              color: ${theme.colors.p500};
            `}
          />
        </div>
      )}
      <div id="sumup-card" hidden={!isReady} />
    </>
  );
}

export default PaymentWidget;
