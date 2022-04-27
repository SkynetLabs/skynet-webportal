import { useState } from "react";

import AuthLayout from "../../layouts/AuthLayout";

import { RecoveryForm } from "../../components/forms/RecoveryForm";
import HighlightedLink from "../../components/HighlightedLink";
import { Metadata } from "../../components/Metadata";

const State = {
  Pure: "PURE",
  Success: "SUCCESS",
  Failure: "FAILURE",
};

const ResetPasswordPage = () => {
  const [state, setState] = useState(State.Pure);

  return (
    <>
      <Metadata>
        <title>Reset Password</title>
      </Metadata>
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
          Don't actually have an account? <HighlightedLink to="/auth/registration">Create one!</HighlightedLink>
        </p>
      </div>
    </>
  );
};

ResetPasswordPage.Layout = AuthLayout;

export default ResetPasswordPage;
