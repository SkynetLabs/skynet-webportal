import * as React from "react";
import skynetClient from "./skynetClient";

export default function useAccountsUrl() {
  const [url, setUrl] = React.useState("");
  const createAccountsUrl = React.useCallback((path = "") => new URL(path, url).toString(), [url]);

  React.useEffect(() => {
    (async function resolve() {
      const portalUrl = new URL(await skynetClient.portalUrl());

      portalUrl.host = `account.${portalUrl.host}`;

      setUrl(portalUrl.toString());
    })();
  }, [setUrl]);

  return createAccountsUrl;
}
