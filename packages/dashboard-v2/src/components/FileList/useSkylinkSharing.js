import { useEffect, useMemo, useState } from "react";
import copy from "copy-text-to-clipboard";

import skynetClient from "../../services/skynetClient";

const COPY_LINK_LABEL = "Copy link";

export const useSkylinkSharing = (skylink) => {
  const [copied, setCopied] = useState(false);
  const [copyLabel, setCopyLabel] = useState(COPY_LINK_LABEL);

  useEffect(() => {
    if (copied) {
      setCopyLabel("Copied!");

      const timeout = setTimeout(() => setCopied(false), 1500);

      return () => clearTimeout(timeout);
    } else {
      setCopyLabel(COPY_LINK_LABEL);
    }
  }, [copied]);

  const options = useMemo(
    () => [
      {
        label: copyLabel,
        callback: async () => {
          setCopied(true);
          copy(await skynetClient.getSkylinkUrl(skylink));
        },
      },
    ],
    [skylink, copyLabel]
  );

  return {
    options,
  };
};
