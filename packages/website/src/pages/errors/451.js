import * as React from "react";
import Link from "../../components/Link";
import ErrorPage from "../../components/ErrorPage";

const statusCode = 451;
const statusReason = "Unavailable For Legal Reasons";

const header = "This file is unavailable for legal reasons";
const subheader = "This Skynet Portal has blocked access to this file, likely for legal reasons";
const redirect = null;
const more = (
  <>
    To learn more, see the{" "}
    <Link
      href="https://support.skynetlabs.com/key-concepts/faqs#is-skynet-censorship-free"
      className="text-primary hover:text-primary-light transition-colors duration-200"
    >
      Skynet FAQ
    </Link>
  </>
);

export default function UnavailableForLegalReasons() {
  return (
    <ErrorPage
      statusCode={statusCode}
      statusReason={statusReason}
      header={header}
      subheader={subheader}
      more={more}
      redirect={redirect}
    />
  );
}
