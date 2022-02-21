import { forwardRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

export const StyledTab = styled.button.attrs(({ active, variant }) => ({
  className: `m-0 pr-2 pb-2
              text-tab text-left font-sans
              transition-colors hover:text-palette-500
              ${active ? "font-semibold text-palette-600" : "font-light text-palette-300"}
              ${variant === "regular" ? "sm:min-w-[180px]" : ""}`,
}))``;

export const Tab = forwardRef(({ active, title, id, variant, ...props }, ref) => (
  <StyledTab
    ref={ref}
    role="tab"
    type="button"
    ariaSelected={`${active ? "true" : "false"}`}
    ariaControls={`tabpanel-${id}`}
    id={`tab-${id}`}
    active={active}
    variant={variant}
    {...props}
  >
    {title}
  </StyledTab>
));

Tab.displayName = "Tab";

Tab.propTypes = {
  /**
   * Used by `Tabs` component to control the `active` property, and also
   * in the HTML markup for accessibility purposes.
   *
   * Should be set to the same value as related `TabPanel`'s `tabId` prop.
   */
  id: PropTypes.string.isRequired,
  /**
   * Used as a label.
   */
  title: PropTypes.string.isRequired,
  /**
   * Controlled by `Tabs` component.
   */
  active: PropTypes.bool,
  /**
   * Controlled by `Tabs` component.
   */
  variant: PropTypes.string,
};

Tab.defaultProps = {
  variant: "regular",
};
