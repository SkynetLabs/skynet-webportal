import { useEffect, useState } from "react";
import useSWR from "swr";

import freePlan from "../../lib/tiers";

import { PlansContext } from "./PlansContext";

/**
 * NOTE:  this function heavily relies on the fact that each Plan's `tier`
 *        property corresponds to the plan's index in UserLimits array in
 *        skynet-accounts code.
 *
 * @see https://github.com/SkynetLabs/skynet-accounts/blob/7337e740b71b77e6d08016db801e293b8ad81abc/database/user.go#L53-L101
 */
const aggregatePlansAndLimits = (plans, limits) => {
  const sortedPlans = [freePlan, ...plans].sort((planA, planB) => planA.tier - planB.tier);

  // Decorate each plan with its corresponding limits data, if available.
  if (limits?.length) {
    return sortedPlans.map((plan) => ({ ...plan, limits: limits[plan.tier] || null }));
  }

  // If we don't have the limits data yet, set just return the plans.

  return sortedPlans;
};

export const PlansProvider = ({ children }) => {
  const { data: rawPlans, error: plansError } = useSWR("stripe/prices");
  const { data: limits, error: limitsError } = useSWR("limits");

  const [plans, setPlans] = useState([freePlan]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (plansError || limitsError) {
      setLoading(false);
      setError(plansError || limitsError);
    } else if (rawPlans) {
      setLoading(false);
      setPlans(aggregatePlansAndLimits(rawPlans, limits?.userLimits));
    }
  }, [rawPlans, limits, plansError, limitsError]);

  return <PlansContext.Provider value={{ plans, error, loading }}>{children}</PlansContext.Provider>;
};
