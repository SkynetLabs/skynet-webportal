import { useCallback, useState } from "react";
import { navigate } from "gatsby";

import { useUser } from "../../contexts/user";
import UserSettingsLayout from "../../layouts/UserSettingsLayout";
import { AccountSettingsForm } from "../../components/forms/AccountSettingsForm";
import { Modal } from "../../components/Modal/Modal";
import { AccountRemovalForm } from "../../components/forms/AccountRemovalForm";
import { Alert } from "../../components/Alert";
import { Metadata } from "../../components/Metadata";
import HighlightedLink from "../../components/HighlightedLink";
import { AvatarUploader } from "../../components/AvatarUploader/AvatarUploader";
import { useMedia } from "react-use";
import theme from "../../lib/theme";

const State = {
  Pure: "PURE",
  Success: "SUCCESS",
  Failure: "FAILURE",
};

const AccountPage = () => {
  const { user, mutate: reloadUser } = useUser();
  const [state, setState] = useState(State.Pure);
  const [removalInitiated, setRemovalInitiated] = useState(false);
  const isLargeScreen = useMedia(`(min-width: ${theme.screens.xl})`);

  const prompt = () => setRemovalInitiated(true);
  const abort = () => setRemovalInitiated(false);

  const onAccountRemoved = useCallback(async () => {
    await reloadUser(null);
    await navigate("/auth/login");
  }, [reloadUser]);

  const onSettingsUpdated = useCallback(
    async (updatedState) => {
      try {
        // Update state locally and request revalidation.
        await reloadUser(updatedState);
      } finally {
        // If revalidation fails, we can't really do much. Request
        // will be auto-retried by SWR, so we'll just show a message
        // about the update request being successful.
        setState(State.Success);
      }
    },
    [reloadUser]
  );

  return (
    <>
      <Metadata>
        <title>Settings</title>
      </Metadata>
      <div className="flex flex-col xl:flex-row">
        <div className="flex flex-col gap-10 lg:shrink-0 lg:max-w-[576px] xl:max-w-[524px]">
          <h4>Account</h4>
          <section className="flex flex-col gap-8">
            {state === State.Failure && (
              <Alert $variant="error">There was an error processing your request. Please try again later.</Alert>
            )}
            {state === State.Success && <Alert $variant="success">Changes saved successfully.</Alert>}
            <AccountSettingsForm user={user} onSuccess={onSettingsUpdated} onFailure={() => setState(State.Failure)} />
          </section>
          <hr />
          <section>
            <h6 className="text-palette-400">Delete account</h6>
            <div className="my-4">
              <p>
                This action will delete your account and <strong>cannot be undone</strong>.
              </p>
              <p>
                Your uploaded files will remain accessible while any portal continues to{" "}
                <HighlightedLink
                  as="a"
                  href="https://support.skynetlabs.com/key-concepts/faqs#what-is-pinning"
                  target="_blank"
                  rel="noreferrer"
                >
                  pin
                </HighlightedLink>{" "}
                them to Skynet.
              </p>
            </div>
            <button
              type="button"
              onClick={prompt}
              className="text-error underline decoration-1 hover:decoration-dashed"
            >
              Delete account
            </button>
          </section>
        </div>
        <div className="flex w-full justify-start xl:justify-end">
          {isLargeScreen && <AvatarUploader className="flex flex-col gap-4" />}
        </div>
        {removalInitiated && (
          <Modal onClose={abort} className="text-center">
            <AccountRemovalForm abort={abort} onSuccess={onAccountRemoved} />
          </Modal>
        )}
      </div>
    </>
  );
};

AccountPage.Layout = UserSettingsLayout;

export default AccountPage;
