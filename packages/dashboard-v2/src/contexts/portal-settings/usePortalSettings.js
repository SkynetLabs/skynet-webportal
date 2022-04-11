import { useContext } from "react";

import { PortalSettingsContext } from "./PortalSettingsContext";

export const usePortalSettings = () => useContext(PortalSettingsContext);
