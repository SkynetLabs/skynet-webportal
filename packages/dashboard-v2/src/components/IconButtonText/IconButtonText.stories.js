import { IconButtonText } from "./IconButtonText";
import { CogIcon } from "../Icons";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "SkynetLibrary/IconButtonText",
  component: IconButtonText,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <IconButtonText {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  primary: true,
  label: "Settings",
  icon: <CogIcon />,
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: "Settings",
  icon: <CogIcon />,
};
