import * as React from "react";
import ErrorPage from "../../components/ErrorPage";

const statusCode = 400;
const statusReason = "Bad Request";

const header = "Bad Request";
const subheader = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor";
const redirect = null;

export default function BadRequest() {
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
