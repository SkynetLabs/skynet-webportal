import useSWR from "swr";
import { useCallback, useRef } from "react";

import UserSettingsLayout from "../../layouts/UserSettingsLayout";

import { AddAPIKeyForm, APIKeyType } from "../../components/forms/AddAPIKeyForm";
import { APIKeyList } from "../../components/APIKeyList/APIKeyList";
import { Alert } from "../../components/Alert";
import { AddSponsorKeyForm } from "../../components/forms/AddSponsorKeyForm";
import { Metadata } from "../../components/Metadata";
import HighlightedLink from "../../components/HighlightedLink";

import apiKeysImg from "../../../static/images/api-keys.svg";

const DeveloperSettingsPage = () => {
  const { data: allKeys = [], mutate: reloadKeys, error } = useSWR("user/apikeys");
  const apiKeys = allKeys.filter(({ public: isPublic }) => isPublic === "false");
  const sponsorKeys = allKeys.filter(({ public: isPublic }) => isPublic === "true");

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
      <Metadata>
        <title>Developer settings</title>
      </Metadata>
      <div className="flex flex-col xl:flex-row">
        <div className="flex flex-col gap-10 lg:shrink-0 lg:max-w-[576px] xl:max-w-[524px] leading-relaxed">
          <div>
            <h4>Developer settings</h4>
            <p>API keys allow developers and applications to extend the functionality of your portal account.</p>
            <p>Skynet uses two types of API keys, explained below.</p>
          </div>

          <hr />

          <section className="flex flex-col gap-2">
            <h5>Sponsor keys</h5>
            <div className="text-palette-500"></div>
            <p>
              Sponsor keys allow users without an account on this portal to download skylinks covered by the API key.
            </p>
            <p>
              Learn more about sponsoring content with Sponsor API Keys{" "}
              <HighlightedLink as="a" href="#">
                here
              </HighlightedLink>
              .
            </p>{" "}
            {/* TODO: missing documentation link */}
            <div className="mt-4">
              <AddSponsorKeyForm ref={publicFormRef} onSuccess={refreshState} />
            </div>
            {error ? (
              <Alert $variant="error" className="mt-4">
                An error occurred while loading your sponsor keys. Please try again later.
              </Alert>
            ) : (
              <div className="mt-4">
                {sponsorKeys?.length > 0 ? (
                  <APIKeyList title="Your public keys" keys={sponsorKeys} reloadKeys={() => refreshState(true)} />
                ) : (
                  <Alert $variant="info">No sponsor keys found.</Alert>
                )}
              </div>
            )}
          </section>

          <hr />

          <section className="flex flex-col gap-2">
            <h5>API keys</h5>
            <p className="text-palette-500">
              These keys allow uploading and downloading skyfiles, as well as reading and writing to the registry.
            </p>
            <div className="mt-4">
              <AddAPIKeyForm ref={generalFormRef} onSuccess={refreshState} type={APIKeyType.General} />
            </div>

            {error ? (
              <Alert $variant="error" className="mt-4">
                An error occurred while loading your API keys. Please try again later.
              </Alert>
            ) : (
              <div className="mt-4">
                {apiKeys?.length > 0 ? (
                  <APIKeyList title="Your API keys" keys={apiKeys} reloadKeys={() => refreshState(true)} />
                ) : (
                  <Alert $variant="info">No API keys found.</Alert>
                )}
              </div>
            )}
          </section>
        </div>
        <div className="hidden xl:block w-full text-right pt-16 pr-5">
          <img src={apiKeysImg} alt="" className="inline-block h-[150px]" />
        </div>
      </div>
    </>
  );
};

DeveloperSettingsPage.Layout = UserSettingsLayout;

export default DeveloperSettingsPage;
