import { NavBar, NavBarLink, NavBarSection } from ".";

export default {
  title: "SkynetLibrary/NavBar",
  component: NavBar,
  subcomponents: {
    NavBarSection,
    NavBarLink,
  },
};

const Template = (props) => <NavBar {...props} />;

export const DashboardTopNavigation = Template.bind({});
DashboardTopNavigation.args = {};
