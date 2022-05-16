import * as React from "react";
import ErrorPage from "../../components/ErrorPage";

const statusCode = 404;
const statusReason = "Not Found";

const header = "We could not load this content";
const subheader = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor";
const redirect = null;

export default function NotFound() {
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
