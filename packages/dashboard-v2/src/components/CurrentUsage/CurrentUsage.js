import { useEffect, useMemo, useState } from "react";
import fileSize from "pretty-bytes";
import { Link } from "gatsby";
import useSWR from "swr";

import { useUser } from "../../contexts/user";
import useActivePlan from "../../hooks/useActivePlan";
import { ContainerLoadingIndicator } from "../LoadingIndicator";

import { GraphBar } from "./GraphBar";
import { UsageGraph } from "./UsageGraph";

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
  const text = fileSize(bytes ?? 0, { maximumFractionDigits: 0 });
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
  const { usage, error, loading } = useUsageData();
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
          <GraphBar value={usage.storageUsed} limit={usage.storageLimit} label={storageUsage} />
          <GraphBar value={usage.filesUsed} limit={usage.filesLimit} label={filesUsedLabel} />
        </UsageGraph>
        <div className="flex place-content-between">
          <span>Files</span>
          <span className="inline-flex place-content-between w-[37%]">
            <Link
              to="/upgrade"
              className="text-primary underline-offset-3 decoration-dotted hover:text-primary-light hover:underline"
            >
              UPGRADE
            </Link>{" "}
            {/* TODO: proper URL */}
            <span>{usage.filesLimit}</span>
          </span>
        </div>
      </div>
    </>
  );
}
