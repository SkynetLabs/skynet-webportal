import { useEffect, useState } from "react";
import { navigate } from "gatsby";
import bytes from "pretty-bytes";

import AuthLayout from "../../layouts/AuthLayout";

import { Alert } from "../../components/Alert";
import HighlightedLink from "../../components/HighlightedLink";
import { SignUpForm } from "../../components/forms/SignUpForm";
import { usePortalSettings } from "../../contexts/portal-settings";
import { PlansProvider, usePlans } from "../../contexts/plans";
import { Metadata } from "../../components/Metadata";

const FreePortalHeader = () => {
  const { plans } = usePlans();

  const freePlan = plans.find(({ price }) => price === 0);
  const freeStorage = freePlan?.limits ? bytes(freePlan.limits?.storageLimit, { binary: true }) : null;

  return (
    <div className="mt-4 mb-8 font-sans">
      <h3>Create your free account</h3>
      {freeStorage && <p className="font-light text-lg">Includes {freeStorage} storage at basic speed</p>}
    </div>
  );
};

const PaidPortalHeader = () => (
  <div className="mt-4 mb-8 font-sans">
    <h3>Create your account</h3>
    <p className="font-light text-sm">
      If you're looking for a free portal, try{" "}
      <HighlightedLink as="a" href="https://skynetfree.net">
        SkynetFree.net
      </HighlightedLink>{" "}
      with 100GB of free storage.
    </p>
  </div>
);

const State = {
  Pure: "PURE",
  Success: "SUCCESS",
  Failure: "FAILURE",
};

const SignUpPage = () => {
  const [state, setState] = useState(State.Pure);
  const { settings } = usePortalSettings();

  useEffect(() => {
    if (state === State.Success) {
      const timer = setTimeout(() => navigate(settings.isSubscriptionRequired ? "/upgrade" : "/"), 3000);

      return () => clearTimeout(timer);
    }
  }, [state, settings.isSubscriptionRequired]);

  return (
    <PlansProvider>
      <Metadata>
        <title>Sign Up</title>
      </Metadata>
      <div className="bg-white px-8 py-10 md:py-32 lg:px-16 xl:px-28 min-h-screen">
        <div className="mb-4 md:mb-16">
          <img src="/images/logo-black-text.svg" alt="Skynet" />
        </div>

        {!settings.areAccountsEnabled && <Alert $variant="info">Accounts are not enabled on this portal.</Alert>}

        {settings.areAccountsEnabled && (
          <>
            {settings.isSubscriptionRequired ? <PaidPortalHeader /> : <FreePortalHeader />}

            {state !== State.Success && (
              <>
                <SignUpForm onSuccess={() => setState(State.Success)} onFailure={() => setState(State.Failure)} />

                <p className="text-sm text-center mt-8">
                  Already have an account? <HighlightedLink to="/auth/login">Sign in</HighlightedLink>
                </p>
              </>
            )}

            {state === State.Success && (
              <div>
                <p className="text-primary font-semibold">Please check your inbox and confirm your email address.</p>
                <p>You will be redirected to your dashboard shortly.</p>
                <HighlightedLink to="/">Click here to go there now.</HighlightedLink>
              </div>
            )}

            {state === State.Failure && (
              <p className="text-error text-center">Something went wrong, please try again later.</p>
            )}
          </>
        )}
      </div>
    </PlansProvider>
  );
};

SignUpPage.Layout = AuthLayout;

export default SignUpPage;
