import { useEffect, useState } from "react";
import { navigate } from "gatsby";

import { AllUsersAuthLayout } from "../../layouts/AuthLayout";

import HighlightedLink from "../../components/HighlightedLink";
import accountsService from "../../services/accountsService";
import { Metadata } from "../../components/Metadata";

const State = {
  Pure: "PURE",
  Success: "SUCCESS",
  Failure: "FAILURE",
};

const EmailConfirmationPage = ({ location }) => {
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  const [state, setState] = useState(State.Pure);

  useEffect(() => {
    const controller = new AbortController();
    let timer;

    async function confirm(token) {
      try {
        await accountsService.get("user/confirm", {
          signal: controller.signal,
          searchParams: { token },
        });

        timer = setTimeout(() => {
          navigate("/");
        }, 3000);
        setState(State.Success);
      } catch (err) {
        // Don't show an error message if request was aborted due to `token` changing.
        if (err.code !== DOMException.ABORT_ERR) {
          setState(State.Failure);
        }
      }
    }

    if (token) {
      confirm(token);
    }

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [token]);

  return (
    <>
      <Metadata>
        <title>Confirm E-mail Address</title>
      </Metadata>
      <div className="text-center">
        {state === State.Pure && <p>Please wait while we verify your account...</p>}

        {state === State.Success && (
          <>
            <p className="text-primary font-semibold">All done!</p>
            <p>You will be redirected to your dashboard shortly.</p>
            <HighlightedLink to="/">Redirect now.</HighlightedLink>
          </>
        )}

        {state === State.Failure && <p className="text-error">Something went wrong, please try again later.</p>}
      </div>
    </>
  );
};

EmailConfirmationPage.Layout = AllUsersAuthLayout;

export default EmailConfirmationPage;
