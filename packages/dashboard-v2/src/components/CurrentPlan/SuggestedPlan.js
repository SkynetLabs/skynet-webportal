import { Link } from "gatsby";
import { useMemo } from "react";

import { Button } from "../Button";

const SuggestedPlan = ({ plans, activePlan }) => {
  const nextPlan = useMemo(() => plans.find(({ tier }) => tier > activePlan.tier), [plans, activePlan]);

  if (!nextPlan) {
    return null;
  }

  return (
    <div className="mt-7">
      <p className="font-sans font-semibold text-xs uppercase text-primary">Discover {nextPlan.name}</p>
      <p className="pt-1 text-xs sm:text-base">{nextPlan.description}</p>
      <Button $primary as={Link} to={`/upgrade?selectedPlan=${nextPlan.id}`} className="mt-6">
        Upgrade
      </Button>
    </div>
  );
};

export default SuggestedPlan;
