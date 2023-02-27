import React, { useEffect, useState, useRef } from 'react';
import { css } from '@emotion/react';
import { useRouter } from 'next/router';

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

import SwiftCheckout from '../components/SwiftCheckout';
import PaymentWidget from '../components/PaymentWidget';

export function DonationCard({ merchantPubId }) {
  const router = useRouter();
  const onSuccess = () => router.push('/thanks');

  const [error, setError] = useState(null);

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

      <div>
        <Body css={cx(center, spacing({ bottom: 'giga' }))}>
          SumUp Swift Checkout ®
        </Body>

        <SwiftCheckout
          merchantPubId={merchantPubId.public_api_key}
          onSuccess={onSuccess}
          onError={setError}
        />

        <Body css={cx(center)}>-- OR --</Body>

        <PaymentWidget onSuccess={onSuccess} onError={setError} />
      </div>

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
