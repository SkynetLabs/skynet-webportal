import * as React from "react";
import ErrorPage from "../../components/ErrorPage";

const statusCode = 403;
const statusReason = "Forbidden";

const header = "You are not authorized to access this content";
const subheader = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor";
const redirect = null;

export default function Forbidden() {
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
