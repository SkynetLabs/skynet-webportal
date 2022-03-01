import * as React from "react";
import styled from "styled-components";

import { PageContainer } from "../components/PageContainer";
import { NavBar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const Layout = styled.div.attrs({
  className: "min-h-screen overflow-hidden",
})`
  background-image: url(/images/dashboard-bg.svg);
  background-position: center -280px;
  background-repeat: no-repeat;
`;

const DashboardLayout = ({ children }) => {
  return (
    <>
      <Layout>
        <NavBar />
        <PageContainer>
          <main className="mt-14">{children}</main>
        </PageContainer>
        <Footer />
      </Layout>
    </>
  );
};

export default DashboardLayout;
