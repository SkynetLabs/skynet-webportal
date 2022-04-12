import { useEffect } from "react";
import { navigate } from "gatsby";

import AuthLayout from "../../layouts/AuthLayout";
import { LoginForm } from "../../components/forms";
import { useUser } from "../../contexts/user";
import { Metadata } from "../../components/Metadata";

const LoginPage = ({ location }) => {
  const { user, mutate: refreshUserState } = useUser();
  const query = new URLSearchParams(location.search);
  const redirectTo = query.get("return_to");

  useEffect(() => {
    if (user) {
      navigate(redirectTo || "/");
    }
  }, [user, redirectTo]);

  return (
    <>
      <Metadata>
        <title>Sign In</title>
      </Metadata>
      <LoginForm
        onSuccess={async () => {
          await refreshUserState();
        }}
      />
    </>
  );
};

LoginPage.Layout = AuthLayout;

export default LoginPage;
