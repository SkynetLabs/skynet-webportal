import { TextIndicator } from "./TextIndicator";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "SkynetLibrary/TextIndicator",
  component: TextIndicator,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <TextIndicator {...args} />;

export const Success = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Success.args = {
  variant: "success",
};

export const Next = Template.bind({});
Next.args = {
  variant: "next",
};

export const Error = Template.bind({});
Error.args = {
  variant: "error",
};
