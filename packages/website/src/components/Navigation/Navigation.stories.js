import React from "react";
import Navigation from "./Navigation";

export default {
  title: "Layout/Navigation",
  component: Navigation,
  argTypes: {
    mode: {
      table: {
        disable: true,
      },
    },
  },
};

const Template = (args) => <Navigation {...args} />;

export const OnDarkBackground = Template.bind({});
OnDarkBackground.parameters = {
  backgrounds: { default: "dark" },
};
OnDarkBackground.args = {
  mode: "dark",
};

export const OnLightBackground = Template.bind({});
OnLightBackground.parameters = {
  backgrounds: { default: "light" },
};
OnLightBackground.args = {
  mode: "light",
};
