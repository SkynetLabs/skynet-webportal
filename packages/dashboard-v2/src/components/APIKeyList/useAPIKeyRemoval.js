import { useCallback, useState } from "react";
import accountsService from "../../services/accountsService";

export const useAPIKeyRemoval = ({ key, onSuccess }) => {
  const [removalInitiated, setRemovalInitiated] = useState(false);
  const [removalError, setRemovalError] = useState(null);

  const prompt = () => {
    setRemovalError(null);
    setRemovalInitiated(true);
  };
  const abort = () => setRemovalInitiated(false);

  const confirm = useCallback(async () => {
    setRemovalError(null);
    try {
      await accountsService.delete(`user/apikeys/${key.id}`);
      setRemovalInitiated(false);
      onSuccess();
    } catch (err) {
      let message = "There was an error processing your request. Please try again later.";

      if (err.response) {
        const response = await err.response.json();
        if (response.message) {
          message = response.message;
        }
      }

      setRemovalError(message);
    }
  }, [onSuccess, key]);

  return {
    removalInitiated,
    removalError,
    prompt,
    abort,
    confirm,
  };
};
