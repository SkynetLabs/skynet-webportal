import { Switch } from "./Switch";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "SkynetLibrary/Switch",
  component: Switch,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <Switch {...args} />;

export const SwitchTrue = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
SwitchTrue.args = {
  defaultChecked: true,
};
export const SwitchFalse = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
SwitchFalse.args = {
  defaultChecked: false,
};
