import { Panel } from "../Panel";
import { DropdownMenu, DropdownMenuLink } from ".";
import { CogIcon, LockClosedIcon } from "../Icons";

export default {
  title: "SkynetLibrary/DropdownMenu",
  component: DropdownMenu,
  subcomponents: {
    DropdownMenuLink,
  },
  decorators: [
    (Story) => (
      <Panel style={{ margin: 50, textAlign: "center" }}>
        <Story />
      </Panel>
    ),
  ],
};

export const NavigationDropdown = () => (
  <DropdownMenu title="My account">
    <DropdownMenuLink href="/settings" icon={CogIcon} label="Settings" active />
    <DropdownMenuLink href="/logout" icon={LockClosedIcon} label="Log out" />
  </DropdownMenu>
);
