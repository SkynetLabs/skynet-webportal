import * as React from "react";
import skynetClient from "./skynetClient";

export default function useAccountsUrl() {
  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    (async function resolve() {
      const portalUrl = new URL(await skynetClient.portalUrl());

      portalUrl.host = `account.${portalUrl.host}`;

      setUrl(portalUrl.toString());
    })();
  }, [setUrl]);

  return url;
}
