import * as React from "react";

import UserSettingsLayout from "../../layouts/UserSettingsLayout";

import { Switch } from "../../components/Switch";
import { StaticImage } from "gatsby-plugin-image";

const NotificationsPage = () => {
  return (
    <>
      <div className="flex">
        <div className="flex flex-col gap-10 lg:shrink-0 lg:max-w-[576px] xl:max-w-[524px]">
          <h4>Notifications</h4>
          <section>
            {/* TODO: saves on change */}
            <Switch onChange={console.info.bind(console)} labelClassName="!items-start flex-col md:flex-row">
              I agreee to get the latest news, updates and special offers delivered to my email inbox.
            </Switch>
          </section>
          <hr />
          <section>
            <h6 className="text-palette-300">Statistics</h6>
            {/* TODO: proper content :) */}
            <p>
              Si sine causa, nollem me tamen laudandis maioribus meis corrupisti nec in malis. Si sine causa, mox
              videro.
            </p>

            <ul className="mt-7 flex flex-col gap-2">
              <li>
                {/* TODO: saves on change */}
                <Switch onChange={console.info.bind(console)}>Storage limit</Switch>
              </li>
              <li>
                {/* TODO: saves on change */}
                <Switch onChange={console.info.bind(console)}>File limit</Switch>
              </li>
            </ul>
          </section>
        </div>
        <div className="hidden xl:block text-right w-full pr-14 pt-20">
          <StaticImage src="../../../static/images/inbox.svg" alt="" placeholder="none" />
        </div>
      </div>
    </>
  );
};

NotificationsPage.Layout = UserSettingsLayout;

export default NotificationsPage;
