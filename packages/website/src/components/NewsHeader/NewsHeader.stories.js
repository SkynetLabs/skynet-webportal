import React from "react";
import NewsHeader from "./NewsHeader";

export default {
  title: "Layout/NewsHeader",
  component: NewsHeader,
};

const Template = (args) => <NewsHeader {...args} />;

export const Default = Template.bind({});
Default.parameters = {};
Default.args = {};
