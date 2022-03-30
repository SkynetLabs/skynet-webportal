import { createContext } from "react";

export const defaultSettings = {
  areAccountsEnabled: false,
  isAuthenticationRequired: false,
  isSubscriptionRequired: false,
};

export const PortalSettingsContext = createContext(defaultSettings);
