import * as React from "react";
import ErrorPage from "../../components/ErrorPage";

const statusCode = 401;
const statusReason = "Unauthorized";

const header = "You must be authenticated to access this content";
const subheader = "You're being redirected to the Log In page of this Skynet Portal";
const redirect = `https://account.${process.env.PORTAL_DOMAIN}/auth/login`;

export default function Unauthorized() {
  return (
    <ErrorPage
      statusCode={statusCode}
      statusReason={statusReason}
      header={header}
      subheader={subheader}
      redirect={redirect}
    />
  );
}
