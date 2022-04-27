import * as React from "react";
import { Link } from "gatsby";
import styled from "styled-components";

import DashboardLayout from "./DashboardLayout";

const Sidebar = () => (
  <aside className="w-full lg:w-48 text-sm font-sans font-light text-palette-600 shrink-0">
    <nav className="bg-white">
      <SidebarLink activeClassName="!border-l-primary" to="/settings">
        Account
      </SidebarLink>
      {/*       
      <SidebarLink activeClassName="!border-l-primary" to="/settings/notifications">
        Notifications
      </SidebarLink>
      <SidebarLink activeClassName="!border-l-primary" to="/settings/export">
        Export
      </SidebarLink>
       */}
      <SidebarLink activeClassName="!border-l-primary" to="/settings/developer-settings">
        Developer settings
      </SidebarLink>
    </nav>
  </aside>
);

const SidebarLink = styled(Link).attrs({
  className: `h-12 py-3 px-6 w-full flex
              border-l-2 border-l-palette-200
              border-b border-b-palette-100 last:border-b-transparent`,
})``;

const Content = styled.main.attrs({
  className: "relative bg-white rounded px-6 py-6 sm:px-16 sm:py-14 mt-6 lg:mt-0 bg-none xl:bg-corner-circle",
})`
  background-repeat: no-repeat;
`;

const UserSettingsLayout = ({ children }) => (
  <DashboardLayout>
    <h6 className="hidden md:block mb-2 text-palette-400">Settings</h6>
    <div className="flex flex-col lg:flex-row">
      <Sidebar />
      <Content className="lg:w-settings-lg xl:w-settings-xl">{children}</Content>
    </div>
  </DashboardLayout>
);

export default UserSettingsLayout;
