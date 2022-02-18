import { Tab, TabPanel, Tabs } from "./";

export default {
  title: "SkynetLibrary/Tabs",
  component: Tabs,
  subcomponents: { Tab, TabPanel },
};

const Template = (props) => (
  <>
    <Tabs {...props}>
      <Tab id="uploads" title="Uploads" />
      <Tab id="downloads" title="Downloads" />
      <TabPanel tabId="uploads">
        <ul>
          <li>Upload #1</li>
          <li>Upload #2</li>
          <li>Upload #3</li>
          <li>Upload #4</li>
        </ul>
      </TabPanel>
      <TabPanel tabId="downloads">
        <ul>
          <li>Download #1</li>
          <li>Download #2</li>
          <li>Download #3</li>
          <li>Download #4</li>
        </ul>
      </TabPanel>
    </Tabs>
  </>
);

const RegularTabs = Template.bind({});

const FillingTabs = Template.bind({});
FillingTabs.args = {
  variant: "fill",
};

const FillingTabsInNarrowContainer = Template.bind({});
FillingTabsInNarrowContainer.args = {
  variant: "fill",
  defaultTab: "downloads",
};
FillingTabsInNarrowContainer.decorators = [
  (Story) => (
    <div style={{ width: 360, background: "#fafafa", padding: 10, border: "1px solid #eee" }}>
      <Story />
    </div>
  ),
];

const MultipleTabsComponents = Template.bind({});
MultipleTabsComponents.args = {
  variant: "fill",
};
MultipleTabsComponents.decorators = [
  (Story) => (
    <div style={{ width: 360, background: "#fafafa", padding: 10, border: "1px solid #eee" }}>
      <Story />
      <Story />
    </div>
  ),
];

export { RegularTabs, FillingTabs, FillingTabsInNarrowContainer, MultipleTabsComponents };
