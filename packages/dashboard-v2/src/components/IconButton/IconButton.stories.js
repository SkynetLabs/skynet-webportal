import { IconButton } from "./IconButton";
import { ArrowRightIcon } from "../Icons";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "SkynetLibrary/IconButton",
  component: IconButton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <IconButton {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  primary: true,
  icon: <ArrowRightIcon />,
};

export const Secondary = Template.bind({});
Secondary.args = {
  icon: <ArrowRightIcon />,
};

export const Large = Template.bind({});
Large.args = {
  size: "large",
  icon: <ArrowRightIcon />,
};

export const Small = Template.bind({});
Small.args = {
  size: "small",
  icon: <ArrowRightIcon />,
};
