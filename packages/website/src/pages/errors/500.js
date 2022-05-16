import * as React from "react";
import ErrorPage from "../../components/ErrorPage";

const statusCode = 500;
const statusReason = "Internal Server Error";

const header = "Internal Server Error";
const subheader = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor";
const redirect = null;

export default function InternalServerError() {
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
