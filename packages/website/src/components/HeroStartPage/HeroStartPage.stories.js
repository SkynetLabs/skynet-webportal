import React from "react";
import HeroStartPage from "./HeroStartPage";

export default {
  title: "Layout/HeroStartPage",
  component: HeroStartPage,
};

const Template = (args) => <HeroStartPage {...args} />;

export const Default = Template.bind({});
Default.parameters = {
  backgrounds: { default: "dark" },
};
Default.args = {};
