import * as React from "react";
import styled from "styled-components";

import { PageContainer } from "../components/PageContainer";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { UserProvider, useUser } from "../contexts/user";
import { FullScreenLoadingIndicator } from "../components/LoadingIndicator";

import dashboardBg from "../../static/images/dashboard-bg.svg";

const Wrapper = styled.div.attrs({
  className: "min-h-screen overflow-hidden",
})`
  background-image: url(${dashboardBg});
  background-position: center -280px;
  background-repeat: no-repeat;
`;

const Layout = ({ children }) => {
  const { user } = useUser();

  // Prevent from flashing the dashboard screen to unauthenticated users.
  return (
    <Wrapper>
      {!user && <FullScreenLoadingIndicator />}
      {user && <>{children}</>}
    </Wrapper>
  );
};

const DashboardLayout = ({ children }) => (
  <>
    <UserProvider>
      <Layout>
        <NavBar />
        <PageContainer className="mt-2 md:mt-14">{children}</PageContainer>
        <Footer />
      </Layout>
    </UserProvider>
  </>
);

export default DashboardLayout;
