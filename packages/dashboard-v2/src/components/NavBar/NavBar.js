import { Link, navigate } from "gatsby";
import styled from "styled-components";

import { screen } from "../../lib/cssHelpers";
import { DropdownMenu, DropdownMenuLink } from "../DropdownMenu";
import { CogIcon, LockClosedIcon, SkynetLogoIcon } from "../Icons";
import { PageContainer } from "../PageContainer";

import { NavBarLink, NavBarSection } from ".";
import accountsService from "../../services/accountsService";

const NavBarContainer = styled.div.attrs({
  className: `grid sticky top-0 bg-white z-10 shadow-sm`,
})``;

const NavBarBody = styled.nav.attrs({
  className: "grid font-sans font-light text-xs sm:text-sm",
})`
  height: 100px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 60px 40px;
  grid-template-areas:
    "logo dropdown"
    "navigation navigation";

  ${screen(
    "sm",
    `
    height: 80px;
    grid-template-columns: auto max-content 1fr;
    grid-template-areas: "logo navigation dropdown";
    grid-template-rows: auto;
  `
  )}

  .navigation-area {
    grid-area: navigation;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  .logo-area {
    grid-area: logo;
    justify-content: start;
  }

  .dropdown-area {
    grid-area: dropdown;
  }
`;

export const NavBar = () => (
  <NavBarContainer>
    <PageContainer className="px-0">
      <NavBarBody>
        <NavBarSection className="logo-area pl-2 pr-4 md:px-0 md:w-[110px] justify-center sm:justify-start">
          <SkynetLogoIcon size={48} />
        </NavBarSection>
        <NavBarSection className="navigation-area border-t border-palette-100">
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
        <NavBarSection className="dropdown-area justify-end">
          <DropdownMenu title="My account">
            <DropdownMenuLink
              to="/settings"
              as={Link}
              activeClassName="text-primary"
              icon={CogIcon}
              label="Settings"
              partiallyActive
            />
            <DropdownMenuLink
              onClick={async () => {
                await accountsService.post("logout");
                navigate("/auth/login");
                // TODO: handle errors
              }}
              activeClassName="text-primary"
              className="cursor-pointer"
              icon={LockClosedIcon}
              label="Log out"
            />
          </DropdownMenu>
        </NavBarSection>
      </NavBarBody>
    </PageContainer>
  </NavBarContainer>
);
