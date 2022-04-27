import * as React from "react";
import { SWRConfig } from "swr";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "@fontsource/sora/300.css"; // light
import "@fontsource/sora/400.css"; // normal
import "@fontsource/sora/500.css"; // medium
import "@fontsource/sora/600.css"; // semibold
import "@fontsource/source-sans-pro/400.css"; // normal
import "@fontsource/source-sans-pro/600.css"; // semibold
import "./src/styles/global.css";
import swrConfig from "./src/lib/swrConfig";
import { MODAL_ROOT_ID } from "./src/components/Modal";
import { PortalSettingsProvider } from "./src/contexts/portal-settings";

const stripePromise = loadStripe(process.env.GATSBY_STRIPE_PUBLISHABLE_KEY);

export function wrapPageElement({ element, props }) {
  const Layout = element.type.Layout ?? React.Fragment;
  return (
    <PortalSettingsProvider>
      <SWRConfig value={swrConfig}>
        <Elements stripe={stripePromise}>
          <Layout {...props}>
            {element}
            <div id={MODAL_ROOT_ID} />
          </Layout>
        </Elements>
      </SWRConfig>
    </PortalSettingsProvider>
  );
}
