import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Card,
  Headline,
  Body,
  NotificationInline,
  cx,
  spacing,
  center,
} from '@sumup/circuit-ui';

import { Meta } from '../components/Meta';
import { Logo } from '../components/Logo';
import { Main } from '../components/Main';

const title = 'Thanks!';

const Page: NextPage = () => {
  const router = useRouter();
  const [counter, setCounter] = useState(6);
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((c) => c - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (counter === 0) {
    router.push('/');
    return null;
  }

  return (
    <>
      <Meta title={title} path="/" />
      <Main>
        <Logo />
        <Card>
          <Headline as="h2" css={cx(center, spacing({ bottom: 'mega' }))}>
            {'SumUp online payments'}
          </Headline>
          <NotificationInline
            headline={'Success'}
            body={'Thanks for the ☕️ 🎉'}
            isVisible
            variant="info"
          />
          <Body css={cx(center, spacing({ top: 'mega' }))}>
            Redirecting you back in {counter}...
          </Body>
        </Card>
        <Link href="https://github.com/cristianoliveira/nextjs-sumup-payments-starter">
          See how it works
        </Link>
      </Main>
    </>
  );
};

export default Page;
