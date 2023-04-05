const defaultConfigs = {
  swift_checkout_sdk: 'https://js.sumup.com/swift-checkout/v1/sdk.js',
  payment_widget_sdk: 'https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js',
};

export default {
  swift_checkout_sdk:
    process.env.NEXT_PUBLIC_SUMUP_SWIFT_CHECKOUT_SDK ||
    defaultConfigs.swift_checkout_sdk,
  payment_widget_sdk:
    process.env.NEXT_PUBLIC_SUMUP_PAYMENT_WIDGET_SDK ||
    defaultConfigs.payment_widget_sdk,
  // To be able to generate this see:
  // see https://js.sumup.com/showroom
  merchant_public_key: process.env.NEXT_PUBLIC_SUMUP_PUBLIC_MERCHANT_KEY,
};
