import { createContext } from "react";

export const defaultSettings = {
  areAccountsEnabled: false,
  isAuthenticationRequired: true,
  isSubscriptionRequired: true,
};

export const PortalSettingsContext = createContext(defaultSettings);
