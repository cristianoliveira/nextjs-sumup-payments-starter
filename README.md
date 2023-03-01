<div align="center">

# Buy me a coffee by SumUp

</div>

This project is mostly a proof of concept to demonstrate how to use the SumUp online payment
ecosystem to start receiving payments online with easy.

## Getting started

First, check our documentation to obtain your credentials.

[SumUp online payments getting started](https://developer.sumup.com/docs/online-payments/introduction/getting-started/)

[Swift Checkout getting started](https://js.sumup.com/showroom)

Then, configure the app by creating a `.env` based on the `.env.example` [file](https://github.com/cristianoliveira/nextjs-sumup-payments-starter/blob/main/.env.example) with your configurations:

```
cp .env.example .env
```

Once edited the configuration, run the development server:

```bash
yarn && yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Implemetation details

You can check the implementations in `components/PaymentWidget.tsx` and `components/SwiftCheckout.tsx`

## Deploy your own using Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcristianoliveira%2Fnextjs-sumup-payments-starter&env=FIXED_AMOUNT_DONATION,FIXED_AMOUNT_CURRENCY,SUMUP_API_CLIENT_ID,SUMUP_API_CLIENT_SECRET,SUMUP_MERCHANT_CODE,SUMUP_MERCHANT_EMAIL&project-name=buymeacoffee-sumup)

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## More examples

For more examples and also an extensive documentation go to [developers.sumup.com](https://developer.sumup.com/)
