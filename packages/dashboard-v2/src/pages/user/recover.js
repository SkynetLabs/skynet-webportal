import { useState } from "react";
import { navigate } from "gatsby";

import AuthLayout from "../../layouts/AuthLayout";

import { ResetPasswordForm } from "../../components/forms/ResetPasswordForm";
import HighlightedLink from "../../components/HighlightedLink";

const State = {
  Pure: "PURE",
  Success: "SUCCESS",
  Failure: "FAILURE",
};

const RecoverPage = ({ location }) => {
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  const [state, setState] = useState(State.Pure);

  return (
    <div className="bg-white px-8 py-10 md:py-32 lg:px-16 xl:px-28 min-h-screen">
      <div className="mb-4 md:mb-16">
        <img src="/images/logo-black-text.svg" alt="Skynet" />
      </div>
      {state !== State.Success && (
        <ResetPasswordForm
          token={token}
          onSuccess={() => {
            setState(State.Success);
            navigate("/");
          }}
          onFailure={() => setState(State.Failure)}
        />
      )}

      {state === State.Success && (
        <p className="text-primary text-center font-semibold">
          All done! You will be redirected to your dashboard shortly.
        </p>
      )}

      {state === State.Failure && (
        <p className="text-error text-center">Something went wrong, please try again later.</p>
      )}

      <p className="text-sm text-center mt-8">
        Suddenly remembered your old password? <HighlightedLink to="/auth/login">Sign in</HighlightedLink>
      </p>
    </div>
  );
};

RecoverPage.Layout = AuthLayout;

export default RecoverPage;
