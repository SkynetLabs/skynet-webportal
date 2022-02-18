import { TextInputBasic } from "./TextInputBasic";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "SkynetLibrary/TextInputBasic",
  component: TextInputBasic,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <TextInputBasic {...args} />;

export const Input = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Input.args = {
  label: "Display Name",
  placeholder: "Your Name",
};
