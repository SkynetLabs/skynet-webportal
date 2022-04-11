import { useCallback, useState } from "react";
import accountsService from "../../services/accountsService";

export const useAPIKeyEdit = ({ key, onSkylinkListUpdate, onSkylinkListUpdateFailure }) => {
  const [editInitiated, setEditInitiated] = useState(false);

  const prompt = () => setEditInitiated(true);
  const abort = () => setEditInitiated(false);
  const updateSkylinkList = useCallback(
    async (action, skylink) => {
      try {
        await accountsService.patch(`user/apikeys/${key.id}`, {
          json: {
            [action]: [skylink],
          },
        });
        onSkylinkListUpdate();

        return true;
      } catch (err) {
        if (err.response) {
          const { message } = await err.response.json();
          onSkylinkListUpdateFailure(message);
        } else {
          onSkylinkListUpdateFailure("Unknown error occured, please try again.");
        }

        return false;
      }
    },
    [onSkylinkListUpdate, onSkylinkListUpdateFailure, key]
  );
  const addSkylink = (skylink) => updateSkylinkList("add", skylink);
  const removeSkylink = (skylink) => updateSkylinkList("remove", skylink);

  return {
    editInitiated,
    prompt,
    abort,
    addSkylink,
    removeSkylink,
  };
};
