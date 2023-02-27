<div align="center">

# Welcome to Buy me a coffee by SumUp

This project is mostly a proof of concept on how to use the SumUp online payment
ecosystem to start receiving payments online.

</div>

## Getting started

First, configure the app by creating a `.env` based on the `.env.example` [file](https://github.com/cristianoliveira/nextjs-sumup-payments-starter/blob/main/.env.example) with your configurations:

```
cp .env.example .env
```

Once edited the configuration, run the development server:

```bash
yarn && yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Deploy your own using Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcristianoliveira%2Fnextjs-sumup-payments-starter&env=FIXED_AMOUNT_DONATION,NEXT_PUBLIC_SUMUP_PUBLIC_MERCHANT_KEY,SUMUP_API_URL,SUMUP_API_CLIENT_ID,SUMUP_API_CLIENT_SECRET,SUMUP_MERCHANT_CODE,SUMUP_MERCHANT_CODE&project-name=buymeacoffee-sumup)

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## More

For more examples and also an extensive documentation go to
https://developer.sumup.com/
