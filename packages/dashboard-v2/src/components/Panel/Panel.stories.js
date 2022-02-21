import { Panel } from "./Panel";

export default {
  title: "SkynetLibrary/Panel",
  component: Panel,
  decorators: [
    (Story) => (
      <div className="inset-0 bg-palette-100 p-6">
        <div style={{ maxWidth: 800 }}>
          <Story />
        </div>
      </div>
    ),
  ],
};

const SampleContent = () => (
  <>
    <p>This is the first paragraph</p>
    <p>This is the second paragraph</p>
    <p>This is the third paragraph</p>
  </>
);

const Template = (args) => (
  <Panel {...args}>
    <SampleContent />
  </Panel>
);

export const RawPanel = Template.bind({});
RawPanel.args = {};

export const TitledPanel = Template.bind({});
TitledPanel.args = {
  title: "Latest activity",
};

export const InlinePanelsExample = () => (
  <div className="grid gap-4 grid-flow-col auto-cols-fr">
    <Panel title="Upload" className="w-50">
      <SampleContent />
    </Panel>
    <Panel title="Usage" className="w-50">
      <SampleContent />
    </Panel>
  </div>
);

export const FullWidthPanelsExample = () => (
  <>
    <Panel title="Latest activity">
      <SampleContent />
    </Panel>
    <Panel title="Payment history">
      <SampleContent />
    </Panel>
  </>
);

export const CustomPanelBackground = Template.bind({});
CustomPanelBackground.args = {
  className: "bg-red-500",
  title: "Background below should be red",
};
