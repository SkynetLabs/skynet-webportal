import { useEffect, useMemo, useState } from "react";
import { Link } from "gatsby";
import cn from "classnames";
import useSWR from "swr";

import { useUser } from "../../contexts/user";
import useActivePlan from "../../hooks/useActivePlan";
import { ContainerLoadingIndicator } from "../LoadingIndicator";

import { GraphBar } from "./GraphBar";
import { UsageGraph } from "./UsageGraph";
import humanBytes from "../../lib/humanBytes";

const useUsageData = () => {
  const { user } = useUser();
  const { activePlan, error } = useActivePlan(user);
  const { data: stats, error: statsError } = useSWR("user/stats");

  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState({});

  const hasError = error || statsError;
  const hasData = activePlan && stats;

  useEffect(() => {
    if (hasData || hasError) {
      setLoading(false);
    }

    if (hasData && !hasError) {
      setUsage({
        filesUsed: stats?.numUploads,
        filesLimit: activePlan?.limits?.maxNumberUploads,
        storageUsed: stats?.totalUploadsSize,
        storageLimit: activePlan?.limits?.storageLimit,
      });
    }
  }, [hasData, hasError, stats, activePlan]);

  return {
    error: error || statsError,
    loading,
    usage,
  };
};

const size = (bytes) => {
  const text = humanBytes(bytes ?? 0, { precision: 0 });
  const [value, unit] = text.split(" ");

  return {
    text,
    value,
    unit,
  };
};

const ErrorMessage = () => (
  <div className="flex text-palette-300 flex-col space-y-4 h-full justify-center items-center">
    <p>We were not able to fetch the current usage data.</p>
    <p>We'll try again automatically.</p>
  </div>
);

export default function CurrentUsage() {
  const { activePlan, plans } = useActivePlan();
  const { usage, error, loading } = useUsageData();
  const nextPlan = useMemo(() => plans.find(({ tier }) => tier > activePlan?.tier), [plans, activePlan]);
  const storageUsage = size(usage.storageUsed);
  const storageLimit = size(usage.storageLimit);
  const filesUsedLabel = useMemo(() => ({ value: usage.filesUsed, unit: "files" }), [usage.filesUsed]);

  if (loading) {
    return <ContainerLoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <>
      <h4>
        {storageUsage.text} of {storageLimit.text}
      </h4>
      <p className="text-palette-400">
        {usage.filesUsed} of {usage.filesLimit} files
      </p>
      <div className="relative mt-7 font-sans uppercase text-xs">
        <div className="flex place-content-between">
          <span>Storage</span>
          <span>{storageLimit.text}</span>
        </div>
        <UsageGraph>
          <GraphBar value={usage.storageUsed} limit={usage.storageLimit} label={storageUsage} className="normal-case" />
          <GraphBar value={usage.filesUsed} limit={usage.filesLimit} label={filesUsedLabel} />
        </UsageGraph>
        <div className="flex place-content-between">
          <span>Files</span>
          <span className="inline-flex place-content-between w-[37%]">
            <Link
              to="/payments"
              className={cn(
                "text-primary underline-offset-3 decoration-dotted hover:text-primary-light hover:underline",
                { invisible: !nextPlan }
              )}
            >
              UPGRADE
            </Link>{" "}
            <span>{usage.filesLimit}</span>
          </span>
        </div>
      </div>
    </>
  );
}
