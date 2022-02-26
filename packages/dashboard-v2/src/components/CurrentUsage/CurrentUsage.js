import * as React from "react";
import fileSize from "pretty-bytes";
import { Link } from "gatsby";

import { GraphBar } from "./GraphBar";
import { UsageGraph } from "./UsageGraph";

// TODO: get real data
const useUsageData = () => ({
  files: {
    used: 19_521,
    limit: 20_000,
  },
  storage: {
    used: 23_000_000_000,
    limit: 1_000_000_000_000,
  },
});

const size = (bytes) => {
  const text = fileSize(bytes, { maximumFractionDigits: 1 });
  const [value, unit] = text.split(" ");

  return {
    text,
    value,
    unit,
  };
};

export default function CurrentUsage() {
  const { files, storage } = useUsageData();

  const storageUsage = size(storage.used);
  const storageLimit = size(storage.limit);
  const filesUsedLabel = React.useMemo(() => ({ value: files.used, unit: "files" }), [files.used]);

  return (
    <>
      <h4>
        {storageUsage.text} of {storageLimit.text}
      </h4>
      <p className="text-palette-400">
        {files.used} of {files.limit} files
      </p>
      <div className="relative mt-7 font-sans uppercase text-xs">
        <div className="flex place-content-between">
          <span>Storage</span>
          <span>{storageLimit.text}</span>
        </div>
        <UsageGraph>
          <GraphBar value={storage.used} limit={storage.limit} label={storageUsage} />
          <GraphBar value={files.used} limit={files.limit} label={filesUsedLabel} />
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
            <span>{files.limit}</span>
          </span>
        </div>
      </div>
    </>
  );
}
