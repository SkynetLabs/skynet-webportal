import { navigate } from "gatsby";

import AuthLayout from "../../layouts/AuthLayout";

import { LoginForm } from "../../components/forms";

const LoginPage = ({ location }) => {
  const query = new URLSearchParams(location.search);
  const redirectTo = query.get("return_to");

  return (
    <div className="bg-white px-8 py-10 md:py-32 lg:px-16 xl:px-28 min-h-screen">
      <div className="mb-4 md:mb-16">
        <img src="/images/logo-black-text.svg" alt="Skynet" />
      </div>
      <LoginForm onSuccess={() => navigate(redirectTo || "/")} />
    </div>
  );
};

LoginPage.Layout = AuthLayout;

export default LoginPage;
