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

import SubscriptionWidget from '../components/SubscriptionWidget';

export const SponsorCard: React.FC<DonationDetails> = ({
  donationAmount,
}) => {
  const router = useRouter();
  const onSuccess = () => router.push('/thanks');

  const [error, setError] = useState(null);

  return (
    <Card>
      <Headline as="h2" css={cx(center, spacing({ bottom: 'mega' }))}>
        {'SumUp online payments'}
      </Headline>
      <Body css={cx(center, spacing({ bottom: 'giga' }))}>
        Sponsor me with {donationAmount} EUR a month ☕️ 😁
      </Body>
      <Body aria-hidden css={cx(center, spacing({ bottom: 'giga' }))}>
        🔨👩🏽‍💻👨🏼‍💻🚀
      </Body>

      <div>
        <Body css={cx(center, spacing({ bottom: 'giga' }))}>
          SumUp Swift Checkout ®
        </Body>

        <span css={cx(center, spacing({ bottom: 'giga' }))}>
          Still not available :(
        </span>

        <Body css={cx(center)}>---- OR ----</Body>

        <SubscriptionWidget onSuccess={onSuccess} onError={setError} />
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
};
