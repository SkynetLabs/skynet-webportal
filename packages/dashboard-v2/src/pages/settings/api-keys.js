import useSWR from "swr";
import { useCallback, useRef } from "react";

import UserSettingsLayout from "../../layouts/UserSettingsLayout";

import { AddAPIKeyForm, APIKeyType } from "../../components/forms/AddAPIKeyForm";
import { APIKeyList } from "../../components/APIKeyList/APIKeyList";
import { Alert } from "../../components/Alert";
import { AddPublicAPIKeyForm } from "../../components/forms/AddPublicAPIKeyForm";

const APIKeysPage = () => {
  const { data: apiKeys = [], mutate: reloadKeys, error } = useSWR("user/apikeys");
  const generalKeys = apiKeys.filter(({ public: isPublic }) => isPublic === "false");
  const publicKeys = apiKeys.filter(({ public: isPublic }) => isPublic === "true");

  const publicFormRef = useRef();
  const generalFormRef = useRef();

  const refreshState = useCallback(
    (resetForms) => {
      if (resetForms) {
        publicFormRef.current?.reset();
        generalFormRef.current?.reset();
      }
      reloadKeys();
    },
    [reloadKeys]
  );

  return (
    <>
      <div className="flex flex-col xl:flex-row">
        <div className="flex flex-col gap-10 lg:shrink-0 lg:max-w-[576px] xl:max-w-[524px]">
          <div>
            <h4>API Keys</h4>
            <p className="leading-relaxed">There are two types of API keys that you can generate for your account.</p>
            <p>Make sure to use the appropriate type.</p>
          </div>

          <hr />

          <section className="flex flex-col gap-2">
            <h5>Public keys</h5>
            <p className="text-palette-500">
              Public keys provide read access to a selected list of skylinks. You can share them publicly.
            </p>

            <div className="mt-4">
              <AddPublicAPIKeyForm ref={publicFormRef} onSuccess={refreshState} />
            </div>

            {error ? (
              <Alert $variant="error" className="mt-4">
                An error occurred while loading your API keys. Please try again later.
              </Alert>
            ) : (
              <div className="mt-4">
                {publicKeys?.length > 0 ? (
                  <APIKeyList title="Your public keys" keys={publicKeys} reloadKeys={() => refreshState(true)} />
                ) : (
                  <Alert $variant="info">No public API keys found.</Alert>
                )}
              </div>
            )}
          </section>
          <hr />

          <section className="flex flex-col gap-2">
            <h5>General keys</h5>
            <p className="text-palette-500">
              These keys provide full access to <b>Accounts</b> service and are equivalent to using a JWT token.
            </p>
            <p className="underline">This type of API keys need to be kept secret and never shared with anyone.</p>

            <div className="mt-4">
              <AddAPIKeyForm ref={generalFormRef} onSuccess={refreshState} type={APIKeyType.General} />
            </div>

            {error ? (
              <Alert $variant="error" className="mt-4">
                An error occurred while loading your API keys. Please try again later.
              </Alert>
            ) : (
              <div className="mt-4">
                {generalKeys?.length > 0 ? (
                  <APIKeyList title="Your general keys" keys={generalKeys} reloadKeys={() => refreshState(true)} />
                ) : (
                  <Alert $variant="info">No general API keys found.</Alert>
                )}
              </div>
            )}
          </section>
        </div>
        <div className="hidden xl:block w-full text-right pt-16 pr-5">
          <img src="/images/api-keys.svg" alt="" className="inline-block h-[150px]" />
        </div>
      </div>
    </>
  );
};

APIKeysPage.Layout = UserSettingsLayout;

export default APIKeysPage;
