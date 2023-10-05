import React, { FC, useEffect, useState } from "react"
import { css } from '@emotion/react';

import apiClient from '../modules/app-api-client';

export const ListPaymentInstruments: FC = () => {
  const [paymentInstruments, setPaymentInstruments] = useState([]);
  const [onlyActive, setOnlyActive] = useState(false)
  useEffect(() => {
    apiClient
      .listPaymentInstruments({ onlyActive })
      .then((paymentInstruments: any) => {
        setPaymentInstruments(paymentInstruments);
      });
  }, [onlyActive]);
  return (
    <div>
      <h1 css={css`
        margin-bottom: 1rem;
        font-size: 2rem;
      `}>List of Payment Instruments</h1>

      <button css={
        css`
          margin-bottom: 1rem;
          padding: 0.5rem 1rem;
        `
      } onClick={() => setOnlyActive(!onlyActive)}>
      {onlyActive ? 'Show All' : 'Show Only Active'}
      </button>

      <ul>
        {paymentInstruments.map((paymentInstrument: any) => (
          <li css={css`
            margin-bottom: 1rem;
          `} key={paymentInstrument.token}>
            <div>Type: {paymentInstrument.type}</div>
            <div>Card: {paymentInstrument.card.last_4_digits}</div>
            <div>Token: {paymentInstrument.token}</div>
            <div>Status: {paymentInstrument.mandate.status}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
