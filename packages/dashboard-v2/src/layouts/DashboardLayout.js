import * as React from "react";
import { Link } from "gatsby";

import styled from "styled-components";
import { DropdownMenu, DropdownMenuLink } from "../components/DropdownMenu";
import { PageContainer } from "../components/PageContainer";
import { CogIcon, SkynetLogoIcon, LockClosedIcon } from "../components/Icons";
import { NavBar, NavBarLink, NavBarSection } from "../components/Navbar";
import { Footer } from "../components/Footer";

const Layout = styled.div.attrs({
  className: "h-screen overflow-hidden",
})`
  background-image: url(/images/dashboard-bg.svg);
  background-position: -300px -280px;

  .navbar {
    grid-template-columns: auto max-content 1fr;
  }
`;

const DashboardLayout = ({ children }) => {
  return (
    <>
      <Layout>
        <NavBar className="navbar">
          <NavBarSection className="w-[110px] justify-start">
            <SkynetLogoIcon size={48} />
          </NavBarSection>
          <NavBarSection>
            <NavBarLink to="/" as={Link} activeClassName="!border-b-primary">
              Dashboard
            </NavBarLink>
            <NavBarLink to="/files" as={Link} activeClassName="!border-b-primary">
              Files
            </NavBarLink>
            <NavBarLink to="/payments" as={Link} activeClassName="!border-b-primary">
              Payments
            </NavBarLink>
          </NavBarSection>
          <NavBarSection className="justify-end">
            <DropdownMenu title="My account">
              <DropdownMenuLink href="/settings" icon={CogIcon} label="Settings" />
              <DropdownMenuLink href="/logout" icon={LockClosedIcon} label="Log out" />
            </DropdownMenu>
          </NavBarSection>
        </NavBar>
        <PageContainer>
          <main className="mt-14">{children}</main>
        </PageContainer>
        <Footer />
      </Layout>
    </>
  );
};

export default DashboardLayout;
