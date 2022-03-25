import { useState } from "react";

import AuthLayout from "../../layouts/AuthLayout";

import { RecoveryForm } from "../../components/forms/RecoveryForm";
import HighlightedLink from "../../components/HighlightedLink";

const State = {
  Pure: "PURE",
  Success: "SUCCESS",
  Failure: "FAILURE",
};

const ResetPasswordPage = () => {
  const [state, setState] = useState(State.Pure);

  return (
    <div className="bg-white px-8 py-10 md:py-32 lg:px-16 xl:px-28 min-h-screen">
      <div className="mb-4 md:mb-16">
        <img src="/images/logo-black-text.svg" alt="Skynet" />
      </div>
      {state !== State.Success && (
        <RecoveryForm onSuccess={() => setState(State.Success)} onFailure={() => setState(State.Failure)} />
      )}

      {state === State.Success && (
        <p className="text-primary text-center font-semibold">Please check your inbox for further instructions.</p>
      )}

      {state === State.Failure && (
        <p className="text-error text-center">Something went wrong, please try again later.</p>
      )}

      <div className="text-sm text-center mt-8">
        <p>
          Suddenly remembered your password? <HighlightedLink to="/auth/login">Sign in</HighlightedLink>
        </p>
        <p>
          Don't actually have an account? <HighlightedLink to="/auth/signup">Create one!</HighlightedLink>
        </p>
      </div>
    </div>
  );
};

ResetPasswordPage.Layout = AuthLayout;

export default ResetPasswordPage;
