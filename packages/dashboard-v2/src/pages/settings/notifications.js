import * as React from "react";

import UserSettingsLayout from "../../layouts/UserSettingsLayout";

import { Switch } from "../../components/Switch";
import { Metadata } from "../../components/Metadata";

import inboxImg from "../../../static/images/inbox.svg";

const NotificationsPage = () => {
  return (
    <>
      <Metadata>
        <title>Notifications</title>
      </Metadata>
      <div className="flex">
        <div className="flex flex-col gap-10 lg:shrink-0 lg:max-w-[576px] xl:max-w-[524px]">
          <h4>Notifications</h4>
          <section>
            {/* TODO: saves on change */}
            <Switch onChange={console.info.bind(console)} labelClassName="!items-start flex-col md:flex-row">
              I agree to receive emails of the latest news, updates and offers.
            </Switch>
          </section>
          <hr />
          <section>
            <h6 className="text-palette-300">Statistics</h6>
            <p>Check below to be notified by email when your usage approaches your plan's limits.</p>
            <ul className="mt-7 flex flex-col gap-2">
              <li>
                {/* TODO: saves on change */}
                <Switch onChange={console.info.bind(console)}>Storage limit</Switch>
              </li>
              <li>
                {/* TODO: saves on change */}
                <Switch onChange={console.info.bind(console)}>Files limit</Switch>
              </li>
            </ul>
          </section>
        </div>
        <div className="hidden xl:block text-right w-full pl-12 pt-20">
          <img src={inboxImg} alt="" className="w-[200px]" />
        </div>
      </div>
    </>
  );
};

NotificationsPage.Layout = UserSettingsLayout;

export default NotificationsPage;
