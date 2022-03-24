import { useState } from "react";
import { useMedia } from "react-use";
import { navigate } from "gatsby";

import { useUser } from "../../contexts/user";
import theme from "../../lib/theme";
import UserSettingsLayout from "../../layouts/UserSettingsLayout";
import { AvatarUploader } from "../../components/AvatarUploader";
import { AccountSettingsForm } from "../../components/forms/AccountSettingsForm";
import { Modal } from "../../components/Modal/Modal";
import { AccountRemovalForm } from "../../components/forms/AccountRemovalForm";
import { Alert } from "../../components/Alert";

const State = {
  Pure: "PURE",
  Success: "SUCCESS",
  Failure: "FAILURE",
};

const AccountPage = () => {
  const isLargeScreen = useMedia(`(min-width: ${theme.screens.xl})`);
  const { user, mutate: reloadUser } = useUser();
  const [state, setState] = useState(State.Pure);
  const [removalInitiated, setRemovalInitiated] = useState(false);

  const prompt = () => setRemovalInitiated(true);
  const abort = () => setRemovalInitiated(false);

  return (
    <>
      <div className="flex flex-col xl:flex-row">
        <div className="flex flex-col gap-10 lg:shrink-0 lg:max-w-[576px] xl:max-w-[524px]">
          <section>
            <h4>Account</h4>
            <p>
              Tum dicere exorsus est laborum et quasi involuta aperiri, altera prompta et expedita. Primum igitur,
              inquit, modo ista sis aequitate.
            </p>
          </section>
          <hr />
          {!isLargeScreen && (
            <section>
              <AvatarUploader className="flex flex-col sm:flex-row gap-8 items-center" />
            </section>
          )}
          <section className="flex flex-col gap-8">
            {state === State.Failure && (
              <Alert $variant="error">There was an error processing your request. Please try again later.</Alert>
            )}
            {state === State.Success && <Alert $variant="success">Changes saved successfully.</Alert>}
            <AccountSettingsForm
              user={user}
              onSuccess={() => {
                reloadUser();
                setState(State.Success);
              }}
              onFailure={() => setState(State.Failure)}
            />
          </section>
          <hr />
          <section>
            <h6 className="text-palette-400">Delete account</h6>
            <p>This will completely delete your account. This process can't be undone.</p>
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
            <AccountRemovalForm abort={abort} onSuccess={() => navigate("/auth/login")} />
          </Modal>
        )}
      </div>
    </>
  );
};

AccountPage.Layout = UserSettingsLayout;

export default AccountPage;
