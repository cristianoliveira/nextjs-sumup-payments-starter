import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const Main = styled('main')(
  ({ theme }: { theme?: { spacings: { mega: string } } }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 450px;
    margin: 0 auto ${theme?.spacings?.mega};
  `,
);
