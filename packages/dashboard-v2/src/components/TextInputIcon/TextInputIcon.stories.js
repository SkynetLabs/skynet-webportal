import { TextInputIcon } from "./TextInputIcon";
import { SearchIcon } from "../Icons";
import { Panel } from "../Panel";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "SkynetLibrary/TextInputIcon",
  component: TextInputIcon,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => (
  <Panel>
    <TextInputIcon {...args} />
  </Panel>
);

export const IconLeft = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
IconLeft.args = {
  icon: <SearchIcon size={20} />,
  placeholder: "Search",
};

export const IconRight = Template.bind({});
IconRight.args = {
  icon: <SearchIcon size={20} />,
  placeholder: "Search",
};
