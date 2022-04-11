import { useEffect, useState } from "react";

import freeTier from "../lib/tiers";
import { usePlans } from "../contexts/plans";

export default function useActivePlan(user) {
  const { plans, loading, error } = usePlans();

  const [activePlan, setActivePlan] = useState(freeTier);

  useEffect(() => {
    if (user) {
      setActivePlan(plans.find((plan) => plan.tier === user.tier));
    }
  }, [plans, user]);

  return {
    error,
    plans,
    loading,
    activePlan,
  };
}
