import { NextPage } from 'next';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { Meta } from '../components/Meta';
import { Logo } from '../components/Logo';
import { DonationCard } from '../components/DonationCard';

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

const Page: NextPage = () => (
  <>
    <Meta title={title} path="/" />
    <Main>
      <Logo />
      <DonationCard />
    </Main>
  </>
);

export default Page;
