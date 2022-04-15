import { useCallback, useState } from "react";

import AuthLayout from "../../layouts/AuthLayout";

import { Alert } from "../../components/Alert";
import HighlightedLink from "../../components/HighlightedLink";
import { SignUpForm } from "../../components/forms/SignUpForm";
import { usePortalSettings } from "../../contexts/portal-settings";
import { PlansProvider, usePlans } from "../../contexts/plans";
import { Metadata } from "../../components/Metadata";
import { useUser } from "../../contexts/user";
import humanBytes from "../../lib/humanBytes";

const FreePortalHeader = () => {
  const { plans } = usePlans();

  const freePlan = plans.find(({ price }) => price === 0);
  const freeStorage = freePlan?.limits ? humanBytes(freePlan.limits?.storageLimit, { binary: true }) : null;

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
  const { mutate: refreshUserState } = useUser();

  const onUserCreated = useCallback(
    (newUser) => {
      refreshUserState(newUser);
    },
    [refreshUserState]
  );

  return (
    <PlansProvider>
      <Metadata>
        <title>Sign Up</title>
      </Metadata>
      <div className="flex flex-col">
        {!settings.areAccountsEnabled && <Alert $variant="info">Accounts are not enabled on this portal.</Alert>}

        {settings.areAccountsEnabled && (
          <>
            {settings.isSubscriptionRequired ? <PaidPortalHeader /> : <FreePortalHeader />}

            {state !== State.Success && (
              <>
                <SignUpForm onSuccess={onUserCreated} onFailure={() => setState(State.Failure)} />

                <p className="text-sm text-center mt-8">
                  Already have an account? <HighlightedLink to="/auth/login">Sign in</HighlightedLink>
                </p>
              </>
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
