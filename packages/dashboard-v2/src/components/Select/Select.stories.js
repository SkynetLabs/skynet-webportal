import { Panel } from "../Panel";
import { Select, SelectOption } from ".";

export default {
  title: "SkynetLibrary/Select",
  component: Select,
  subcomponents: {
    SelectOption,
  },
  decorators: [
    (Story) => (
      <Panel style={{ margin: 50, textAlign: "center" }}>
        <Story />
      </Panel>
    ),
  ],
};

const Template = (props) => (
  <Select {...props}>
    <SelectOption value="name-asc" label="A-Z" />
    <SelectOption value="name-desc" label="Z-A" />
    <SelectOption value="size-desc" label="Biggest size" />
    <SelectOption value="size-asc" label="Smallest size" />
    <SelectOption value="date-desc" label="Latest" />
    <SelectOption value="date-asc" label="Oldest" />
  </Select>
);
Template.args = {};

export const NoDefaultNoPlaceholder = Template.bind({});
NoDefaultNoPlaceholder.args = {
  onChange: console.info.bind(console, "onChange"),
};

export const WithPlaceholder = Template.bind({});
WithPlaceholder.args = {
  placeholder: "Select...",
  onChange: console.info.bind(console, "onChange"),
};

export const WithDefautValue = Template.bind({});
WithDefautValue.args = {
  defaultValue: "size-desc",
  placeholder: "Select...",
  onChange: console.info.bind(console, "onChange"),
};
