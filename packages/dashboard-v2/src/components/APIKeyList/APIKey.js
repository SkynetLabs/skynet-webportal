import dayjs from "dayjs";
import cn from "classnames";
import { useCallback, useState } from "react";

import { Alert } from "../Alert";
import { Button } from "../Button";
import { AddSkylinkToSponsorKeyForm } from "../forms/AddSkylinkToSponsorKeyForm";
import { CogIcon, TrashIcon } from "../Icons";
import { Modal } from "../Modal";

import { useAPIKeyEdit } from "./useAPIKeyEdit";
import { useAPIKeyRemoval } from "./useAPIKeyRemoval";

export const APIKey = ({ apiKey, onRemoved, onEdited, onRemovalError }) => {
  const { id, name, createdAt, skylinks } = apiKey;
  const isSponsorKey = apiKey.public === "true";
  const [error, setError] = useState(null);

  const onSkylinkListEdited = useCallback(() => {
    setError(null);
    onEdited();
  }, [onEdited]);

  const onSkylinkListEditFailure = (errorMessage) => setError(errorMessage);

  const {
    removalError,
    removalInitiated,
    prompt: promptRemoval,
    abort: abortRemoval,
    confirm: confirmRemoval,
  } = useAPIKeyRemoval({
    key: apiKey,
    onSuccess: onRemoved,
    onFailure: onRemovalError,
  });

  const {
    editInitiated,
    prompt: promptEdit,
    abort: abortEdit,
    addSkylink,
    removeSkylink,
  } = useAPIKeyEdit({
    key: apiKey,
    onSkylinkListUpdate: onSkylinkListEdited,
    onSkylinkListUpdateFailure: onSkylinkListEditFailure,
  });

  const closeEditModal = useCallback(() => {
    setError(null);
    abortEdit();
  }, [abortEdit]);

  const skylinksNumber = skylinks?.length ?? 0;
  const isNotConfigured = isSponsorKey && skylinksNumber === 0;
  const skylinksPhrasePrefix = skylinksNumber === 0 ? "No" : skylinksNumber;
  const skylinksPhrase = `${skylinksPhrasePrefix} ${skylinksNumber === 1 ? "skylink" : "skylinks"} sponsored`;

  return (
    <li
      className={cn(
        "grid grid-cols-2 sm:grid-cols-[1fr_repeat(2,_max-content)] py-3 px-4 gap-x-8 items-center bg-white odd:bg-palette-100/50"
      )}
    >
      <span className="col-span-2 sm:col-span-1 flex items-center">
        <span className="flex flex-col">
          <span className={cn("truncate", { "text-palette-300": !name })}>{name || "unnamed key"}</span>
          {isSponsorKey && (
            <button
              onClick={promptEdit}
              className={cn("text-xs hover:underline decoration-dotted", {
                "text-error": isNotConfigured,
                "text-palette-400": !isNotConfigured,
              })}
            >
              {skylinksPhrase}
            </button>
          )}
        </span>
      </span>
      <span className="col-span-2 my-4 border-t border-t-palette-200/50 sm:hidden" />
      <span className="text-palette-400">{dayjs(createdAt).format("MMM DD, YYYY")}</span>
      <span className="flex items-center justify-end">
        {isSponsorKey && (
          <button
            title="Add or remove skylinks"
            aria-label="Add or remove skylinks"
            className="p-1 transition-colors hover:text-primary"
            onClick={promptEdit}
          >
            <CogIcon size={22} />
          </button>
        )}
        <button
          title="Delete this API key"
          aria-label="Delete this API key"
          className="p-1 transition-colors hover:text-error"
          onClick={promptRemoval}
        >
          <TrashIcon size={16} />
        </button>
      </span>

      {removalInitiated && (
        <Modal onClose={abortRemoval} className="flex flex-col gap-4 text-center">
          <h4>Delete API key</h4>
          <div>
            <p>Are you sure you want to delete the following API key?</p>
            <p className="font-semibold">{name || id}</p>
          </div>
          {removalError && <Alert $variant="error">{removalError}</Alert>}

          <div className="flex gap-4 justify-center mt-4">
            <Button $primary onClick={abortRemoval}>
              Cancel
            </Button>
            <Button onClick={confirmRemoval}>Delete</Button>
          </div>
        </Modal>
      )}
      {editInitiated && (
        <Modal onClose={closeEditModal} className="flex flex-col gap-4 text-center sm:px-8 sm:py-6">
          <h4>Sponsored skylinks</h4>
          {skylinks?.length > 0 ? (
            <ul className="text-xs flex flex-col gap-2">
              {skylinks.map((skylink) => (
                <li key={skylink} className="grid grid-cols-[1fr_min-content] w-full gap-4 items-center">
                  <code className="whitespace-nowrap select-all truncate bg-palette-100 odd:bg-white p-1">
                    {skylink}
                  </code>
                  <button
                    className="p-1 transition-colors hover:text-error"
                    onClick={() => removeSkylink(skylink)}
                    aria-label="Remove skylink"
                  >
                    <TrashIcon size={16} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <Alert $variant="info">No skylinks here yet. You can add the first one below 🙃</Alert>
          )}

          <div className="flex flex-col gap-4">
            {error && <Alert $variant="error">{error}</Alert>}
            <AddSkylinkToSponsorKeyForm addSkylink={addSkylink} />
          </div>
          <div className="flex gap-4 justify-center mt-4">
            <Button onClick={closeEditModal}>Close</Button>
          </div>
        </Modal>
      )}
    </li>
  );
};
