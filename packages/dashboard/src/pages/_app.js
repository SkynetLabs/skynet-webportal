import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ToastContainer } from "react-toastify";
import Head from "next/head";
import "normalize.css";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/globals.css";
import "@fontsource/sora/300.css"; // light
import "@fontsource/sora/400.css"; // normal
import "@fontsource/sora/500.css"; // medium
import "@fontsource/sora/600.css"; // semibold
import "@fontsource/source-sans-pro/400.css"; // normal
import "@fontsource/source-sans-pro/600.css"; // semibold

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function MyApp({ Component, pageProps }) {
  return (
    <Elements stripe={stripePromise}>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <title key="title">Skynet</title>
      </Head>
      <Component {...pageProps} />
      <ToastContainer bodyClassName={() => "Toastify__toast-body text-sm font-medium text-palette-500"} />
    </Elements>
  );
}

export default MyApp;
