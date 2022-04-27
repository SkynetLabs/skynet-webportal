import { useMemo, useState } from "react";

import accountsService from "../../services/accountsService";
import skynetClient from "../../services/skynetClient";

export const useSkylinkOptions = ({ skylink, onUpdated }) => {
  const [inProgress, setInProgress] = useState(false);

  const options = useMemo(
    () => [
      {
        label: "Preview",
        callback: async () => window.open(await skynetClient.getSkylinkUrl(skylink)),
      },
      {
        label: "Download",
        callback: () => skynetClient.downloadFile(skylink),
      },
      {
        label: "Unpin",
        callback: async () => {
          setInProgress(true);
          await accountsService.delete(`user/uploads/${skylink}`);
          await onUpdated(); // No need to setInProgress(false), since at this point this hook should already be unmounted
        },
      },
    ],
    [skylink, onUpdated]
  );

  return {
    inProgress,
    options,
  };
};
