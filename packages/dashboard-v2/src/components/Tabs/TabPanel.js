import PropTypes from "prop-types";

/**
 * Besides documented props, it accepts all HMTL attributes a `<div>` element does.
 */
export const TabPanel = ({ children, active, tabId, ...props }) => {
  if (!active) {
    return null;
  }

  return (
    <div role="tabpanel" id={`tabpanel-${tabId}`} aria-labelledby={`tab-${tabId}`} {...props}>
      {children}
    </div>
  );
};

TabPanel.propTypes = {
  /**
   * Used by `Tabs` component to control the `active` property, and also
   * in the HTML markup for accessibility purposes.
   *
   * Should be set to the same value as related `Tab`'s `id` prop.
   */
  tabId: PropTypes.string.isRequired,
  children: PropTypes.node,
  /**
   * Controlled by `Tabs` component.
   */
  active: PropTypes.bool,
};
