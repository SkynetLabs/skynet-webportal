import { useEffect, useState } from "react";

import AuthLayout from "../../layouts/AuthLayout";

import HighlightedLink from "../../components/HighlightedLink";
import { SignUpForm } from "../../components/forms/SignUpForm";
import { navigate } from "gatsby";

const State = {
  Pure: "PURE",
  Success: "SUCCESS",
  Failure: "FAILURE",
};

const SignUpPage = () => {
  const [state, setState] = useState(State.Pure);

  useEffect(() => {
    if (state === State.Success) {
      const timer = setTimeout(() => navigate("/"), 3000);

      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <div className="bg-white px-8 py-10 md:py-32 lg:px-16 xl:px-28 min-h-screen">
      <div className="mb-4 md:mb-16">
        <img src="/images/logo-black-text.svg" alt="Skynet" />
      </div>
      {state !== State.Success && (
        <SignUpForm onSuccess={() => setState(State.Success)} onFailure={() => setState(State.Failure)} />
      )}

      {state === State.Success && (
        <div className="text-center">
          <p className="text-primary font-semibold">Please check your inbox and confirm your email address.</p>
          <p>You will be redirected to your dashboard shortly.</p>
          <HighlightedLink to="/">Click here to go there now.</HighlightedLink>
        </div>
      )}

      {state === State.Failure && (
        <p className="text-error text-center">Something went wrong, please try again later.</p>
      )}

      <p className="text-sm text-center mt-8">
        Already have an account? <HighlightedLink to="/auth/login">Sign in</HighlightedLink>
      </p>
    </div>
  );
};

SignUpPage.Layout = AuthLayout;

export default SignUpPage;
