import { NavBar, NavBarLink, NavBarSection } from ".";

export default {
  title: "SkynetLibrary/NavBar",
  component: NavBar,
  subcomponents: {
    NavBarSection,
    NavBarLink,
  },
};

const Template = (props) => (
  <NavBar {...props}>
    <NavBarSection>
      <NavBarLink href="/dashboard" active>
        Dashboard
      </NavBarLink>
      <NavBarLink href="/files">Files</NavBarLink>
      <NavBarLink href="/payments">Payments</NavBarLink>
    </NavBarSection>
  </NavBar>
);

export const DashboardTopNavigation = Template.bind({});
DashboardTopNavigation.args = {};
