import React from "react";
import { ProgressBar } from "./ProgressBar";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "SkynetLibrary/ProgressBar",
  component: ProgressBar,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <ProgressBar {...args} />;

export const Uploading = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Uploading.args = {
  status: "uploading",
  percentage: 65,
};

export const Complete = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Complete.args = {
  status: "complete",
};

export const Enqueued = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Enqueued.args = {
  status: "enqueued",
};

export const Error = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Error.args = {
  status: "error",
};
