import * as React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import { SWRConfig } from "swr";

import { authenticatedOnly } from "../lib/swrConfig";

import { PageContainer } from "../components/PageContainer";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { UserProvider, useUser } from "../contexts/user";
import { ContainerLoadingIndicator } from "../components/LoadingIndicator";

const Wrapper = styled.div.attrs({
  className: "min-h-screen overflow-hidden",
})`
  background-image: url(/images/dashboard-bg.svg);
  background-position: center -280px;
  background-repeat: no-repeat;
`;

const Layout = ({ children }) => {
  const { user } = useUser();

  // Prevent from flashing the dashboard screen to unauthenticated users.
  return (
    <Wrapper>
      {!user && (
        <div className="fixed inset-0 flex justify-center items-center bg-palette-100/50">
          <ContainerLoadingIndicator className="!text-palette-200/50" />
        </div>
      )}
      {user && <>{children}</>}
    </Wrapper>
  );
};

const Sidebar = () => (
  <aside className="w-full lg:w-48 bg-white text-sm font-sans font-light text-palette-600 shrink-0">
    <nav>
      <SidebarLink activeClassName="!border-l-primary" to="/settings">
        Account
      </SidebarLink>
      <SidebarLink activeClassName="!border-l-primary" to="/settings/notifications">
        Notifications
      </SidebarLink>
      <SidebarLink activeClassName="!border-l-primary" to="/settings/export">
        Export
      </SidebarLink>
      <SidebarLink activeClassName="!border-l-primary" to="/settings/api-keys">
        API Keys
      </SidebarLink>
    </nav>
  </aside>
);

const SidebarLink = styled(Link).attrs({
  className: `h-12 py-3 px-6 h-full w-full flex
              border-l-2 border-l-palette-200
              border-b border-b-palette-100 last:border-b-transparent`,
})``;

const Content = styled.main.attrs({
  className: "relative bg-white rounded px-6 py-6 sm:px-16 sm:py-14 mt-6 lg:mt-0 bg-none xl:bg-corner-circle",
})`
  background-repeat: no-repeat;
`;

const UserSettingsLayout = ({ children }) => (
  <SWRConfig value={authenticatedOnly}>
    <UserProvider>
      <Layout>
        <NavBar />
        <PageContainer className="mt-2 md:mt-14">
          <h6 className="hidden md:block mb-2 text-palette-400">Settings</h6>
          <div className="flex flex-col lg:flex-row">
            <Sidebar />
            <Content className="lg:w-settings-lg xl:w-settings-xl">{children}</Content>
          </div>
        </PageContainer>
        <Footer />
      </Layout>
    </UserProvider>
  </SWRConfig>
);

export default UserSettingsLayout;
