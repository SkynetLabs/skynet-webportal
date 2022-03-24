import { useCallback, useState } from "react";
import accountsService from "../../services/accountsService";

export const useAPIKeyEdit = ({ key, onSkylinkRemoved, onSkylinkRemovalFailure }) => {
  const [editInitiated, setEditInitiated] = useState(false);

  const prompt = () => setEditInitiated(true);
  const abort = () => setEditInitiated(false);
  const removeSkylink = useCallback(
    async (skylink) => {
      try {
        await accountsService.patch(`user/apikeys/${key.id}`, {
          json: {
            remove: [skylink],
          },
        });
        onSkylinkRemoved();
      } catch {
        onSkylinkRemovalFailure();
      }
    },
    [onSkylinkRemoved, onSkylinkRemovalFailure, key]
  );

  return {
    editInitiated,
    prompt,
    abort,
    removeSkylink,
  };
};
