import * as React from "react";
import { useMedia } from "react-use";
import styled from "styled-components";

import theme from "../../lib/theme";
import UserSettingsLayout from "../../layouts/UserSettingsLayout";
import { TextInputBasic } from "../../components/TextInputBasic/TextInputBasic";
import { Button } from "../../components/Button";
import { AvatarUploader } from "../../components/AvatarUploader";

const FormGroup = styled.div.attrs({
  className: "grid sm:grid-cols-[1fr_min-content] w-full gap-y-2 gap-x-4 items-end",
})``;

const AccountPage = () => {
  const isLargeScreen = useMedia(`(min-width: ${theme.screens.xl})`);
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
            <FormGroup>
              <TextInputBasic label="Display name" placeholder="John Doe" />
              <div className="flex mt-2 sm:mt-0 justify-center">
                <Button>Update</Button>
              </div>
            </FormGroup>
            <FormGroup>
              <TextInputBasic label="Email" placeholder="john.doe@example.com" />
              <div className="flex mt-2 sm:mt-0 justify-center">
                <Button>Update</Button>
              </div>
            </FormGroup>
            <FormGroup>
              <TextInputBasic type="password" label="Password" placeholder="dbf3htf*efh4pcy@PXB" />
              <div className="flex mt-2 sm:mt-0 justify-center order-last sm:order-none">
                <Button>Update</Button>
              </div>
              <small className="text-palette-400">
                The password must be at least 6 characters long. Significantly different from the email and old
                password.
              </small>
            </FormGroup>
          </section>
          <hr />
          <section>
            <h6 className="text-palette-400">Delete account</h6>
            <p>This will completely delete your account. This process can't be undone.</p>
            <button
              type="button"
              onClick={() => window.confirm("TODO: confirmation modal")}
              className="text-error underline decoration-1 hover:decoration-dashed"
            >
              Delete account
            </button>
          </section>
        </div>
        <div className="flex w-full justify-start xl:justify-end">
          {isLargeScreen && <AvatarUploader className="flex flex-col gap-4" />}
        </div>
      </div>
    </>
  );
};

AccountPage.Layout = UserSettingsLayout;

export default AccountPage;
