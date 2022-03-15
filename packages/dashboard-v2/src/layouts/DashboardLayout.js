import * as React from "react";
import styled from "styled-components";
import { SWRConfig } from "swr";

import { authenticatedOnly } from "../lib/swrConfig";

import { PageContainer } from "../components/PageContainer";
import { NavBar } from "../components/Navbar";
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

const DashboardLayout = ({ children }) => {
  return (
    <>
      <SWRConfig value={authenticatedOnly}>
        <UserProvider>
          <Layout>
            <NavBar />
            <PageContainer>
              <main className="mt-14">{children}</main>
            </PageContainer>
            <Footer />
          </Layout>
        </UserProvider>
      </SWRConfig>
    </>
  );
};

export default DashboardLayout;
