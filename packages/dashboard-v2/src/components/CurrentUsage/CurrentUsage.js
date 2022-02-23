import * as React from "react";
import fileSize from "byte-size";
import { Link } from "gatsby";

import { GraphBar } from "./GraphBar";
import { UsageGraph } from "./UsageGraph";

// TODO: get real data
const useUsageData = () => ({
  filesUsed: 19_521,
  filesLimit: 20_000,
  storageUsed: 23_000_000_000,
  storageLimit: 1_000_000_000_000,
});

const size = (bytes) => fileSize(bytes, { precision: 0 });

export default function CurrentUsage() {
  const { filesUsed, filesLimit, storageUsed, storageLimit } = useUsageData();

  return (
    <>
      <h4>{`${size(storageUsed)} of ${size(storageLimit)}`}</h4>
      <p className="text-palette-400">
        {filesUsed} of {filesLimit} files
      </p>
      <div className="relative mt-7 font-sans uppercase text-xs">
        <div className="flex place-content-between">
          <span>Storage</span>
          <span>{`${size(storageLimit)}`}</span>
        </div>
        <UsageGraph>
          <GraphBar value={storageUsed} limit={storageLimit} label={size(storageUsed)} />
          <GraphBar value={filesUsed} limit={filesLimit} label={{ value: filesUsed, unit: "files" }} />
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
            <span>{filesLimit}</span>
          </span>
        </div>
      </div>
    </>
  );
}
