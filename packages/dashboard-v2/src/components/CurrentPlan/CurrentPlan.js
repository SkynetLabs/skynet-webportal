import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useUser } from "../../contexts/user";
import useActivePlan from "../../hooks/useActivePlan";
import humanBytes from "../../lib/humanBytes";
import { ContainerLoadingIndicator } from "../LoadingIndicator";

import LatestPayment from "./LatestPayment";
import SuggestedPlan from "./SuggestedPlan";

dayjs.extend(relativeTime);

const CurrentPlan = () => {
  const { user, error: userError } = useUser();
  const { plans, activePlan, error: plansError } = useActivePlan(user);

  if (!user || !activePlan) {
    return <ContainerLoadingIndicator />;
  }

  if (userError || plansError) {
    return (
      <div className="flex text-palette-300 flex-col space-y-4 h-full justify-center items-center">
        <p>An error occurred while loading this data.</p>
        <p>We'll retry automatically.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <h4>{activePlan.name}</h4>
      <div className="text-palette-400 justify-between flex flex-col grow">
        {activePlan.price === 0 && activePlan.limits && (
          <p>{humanBytes(activePlan.limits.storageLimit)} without paying a dime! 🎉</p>
        )}
        {activePlan.price !== 0 &&
          (user.subscriptionCancelAtPeriodEnd ? (
            <p>Your subscription expires {dayjs(user.subscribedUntil).fromNow()}</p>
          ) : (
            <p className="first-letter:uppercase">{dayjs(user.subscribedUntil).fromNow(true)} until the next payment</p>
          ))}

        {user.subscriptionStatus && <LatestPayment user={user} />}
        <SuggestedPlan plans={plans} activePlan={activePlan} />
      </div>
    </div>
  );
};

export default CurrentPlan;
