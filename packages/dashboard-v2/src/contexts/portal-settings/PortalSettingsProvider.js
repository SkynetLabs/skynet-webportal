import { useEffect, useState } from "react";
import useSWRImmutable from "swr/immutable";

import skynetClient from "../../services/skynetClient";

import { defaultSettings, PortalSettingsContext } from "./PortalSettingsContext";

const fetcher = async (path) => {
  try {
    const baseUrl = await skynetClient.portalUrl();

    return fetch(`${baseUrl}/${path}`).then((response) => response.json());
  } catch (error) {
    return fetch(path).then((response) => response.json());
  }
};

export const PortalSettingsProvider = ({ children }) => {
  const { data, error } = useSWRImmutable("__internal/do/not/use/accounts", fetcher);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    if (data || error) {
      setLoading(false);
    }
    if (data) {
      setSettings({
        areAccountsEnabled: data.enabled,
        isAuthenticationRequired: data.auth_required,
        isSubscriptionRequired: data.subscription_required,
      });
    }
  }, [data, error]);

  return (
    <PortalSettingsContext.Provider value={{ settings, error, loading }}>{children}</PortalSettingsContext.Provider>
  );
};
