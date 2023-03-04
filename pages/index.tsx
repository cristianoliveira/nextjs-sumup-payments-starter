import { NextPage } from 'next';
import Link from 'next/link';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { Meta } from '../components/Meta';
import { Logo } from '../components/Logo';
import { DonationCard } from '../components/DonationCard';

import fetchSettings from '../modules/app-fetch-settings';

const Main = styled('main')(
  ({ theme }: { theme?: { spacings: { mega: string } } }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 450px;
    margin: 0 auto ${theme?.spacings?.mega};
  `,
);

const title = 'Welcome to SumUp Next.js';

const Page: NextPage<DonationDetails> = ({
  merchantPublicKey,
  donationAmount,
}) => (
  <>
    <Meta title={title} path="/" />
    <Main>
      <Logo />
      <DonationCard
        merchantPublicKey={merchantPublicKey}
        donationAmount={donationAmount}
      />
      <Link href="https://github.com/cristianoliveira/nextjs-sumup-payments-starter">
        See how it works
      </Link>
    </Main>
  </>
);

export async function getStaticProps(): Promise<{ props: DonationDetails }> {
  const donationDetails = await fetchSettings();

  return {
    props: donationDetails,
  };
}

export default Page;
