import { useEffect, useState } from "react";
import useSWR from "swr";
import freeTier from "../lib/tiers";

export default function useSubscriptionPlans(user) {
  const { data: paidPlans, error, mutate } = useSWR("stripe/prices");
  const [plans, setPlans] = useState([freeTier]);
  const [activePlan, setActivePlan] = useState(freeTier);

  useEffect(() => {
    if (paidPlans) {
      setPlans((plans) => [...plans, ...paidPlans].sort((planA, planB) => planA.tier - planB.tier));
    }
  }, [paidPlans]);

  useEffect(() => {
    if (user) {
      setActivePlan(plans.find((plan) => plan.tier === user.tier));
    }
  }, [plans, user]);

  return {
    error,
    mutate,
    plans,
    activePlan,
  };
}
