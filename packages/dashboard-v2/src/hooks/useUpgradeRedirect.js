import { navigate } from "gatsby";
import { useEffect, useState } from "react";

import { usePortalSettings } from "../contexts/portal-settings";
import { useUser } from "../contexts/user";
import freeTier from "../lib/tiers";

export default function useUpgradeRedirect() {
  const [verifyingSubscription, setVerifyingSubscription] = useState(true);
  const { user, loading: userDataLoading } = useUser();
  const { settings, loading: portalSettingsLoading } = usePortalSettings();

  useEffect(() => {
    setVerifyingSubscription(true);
    const isDataLoaded = !userDataLoading && !portalSettingsLoading && user && settings;
    const hasPaidSubscription = user.tier > freeTier.tier;

    if (isDataLoaded) {
      if (settings.isSubscriptionRequired && !hasPaidSubscription) {
        navigate("/payments");
      } else {
        setVerifyingSubscription(false);
      }
    }
  }, [user, userDataLoading, settings.isSubscriptionRequired, portalSettingsLoading, settings]);

  return {
    verifyingSubscription,
  };
}
