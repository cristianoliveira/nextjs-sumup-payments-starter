import { NextPage } from 'next';
import Link from 'next/link';

import { Meta } from '../components/Meta';
import { Logo } from '../components/Logo';
import { Main } from '../components/Main';
import { SponsorCard } from '../components/SponsorCard';

import fetchSettings from '../modules/app-fetch-settings';

const title = 'Buy me a coffee by SumUp OP';

const Page: NextPage<DonationDetails> = ({
  donationAmount,
}) => (
  <>
    <Meta title={title} path="/" />
    <Main>
      <Logo />
      <SponsorCard
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
