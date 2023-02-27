import { NextPage } from 'next';
import Link from 'next/link';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { Meta } from '../components/Meta';
import { Logo } from '../components/Logo';
import { DonationCard } from '../components/DonationCard';

import fetchMerchantPublicId, {
  MerchantPublicId,
} from '../modules/sumup-merchant-public-id';

const Main = styled('main')(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 450px;
    margin: 0 auto ${theme.spacings.mega};
  `,
);

const title = 'Welcome to SumUp Next.js';

const Page: NextPage = ({
  merchantPubId,
}: {
  merchantPubId: MerchantPublicId;
}) => (
  <>
    <Meta title={title} path="/" />
    <Main>
      <Logo />
      <DonationCard merchantPubId={merchantPubId} />
      <Link href="https://github.com/cristianoliveira/nextjs-sumup-payments-starter">
        See how it works
      </Link>
    </Main>
  </>
);

export async function getStaticProps() {
  const merchantPubId = await fetchMerchantPublicId();

  return {
    props: {
      merchantPubId,
    },
  };
}

export default Page;
