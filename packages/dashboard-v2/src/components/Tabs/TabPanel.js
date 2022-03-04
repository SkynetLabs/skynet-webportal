import PropTypes from "prop-types";
import { useEffect, useState } from "react";

/**
 * Besides documented props, it accepts all HMTL attributes a `<div>` element does.
 */
export const TabPanel = ({ children, active, tabId, ...props }) => {
  const [wasActivated, setWasActivated] = useState(false);

  useEffect(() => {
    if (active) {
      setWasActivated(true);
    }
  }, [active]);

  // If the TabPanel was never activated, let's not render its children at all.
  // We'll only render them after the first activation and then won't unmount them
  // unless the entire TabPanel is unmounted, too.
  if (!active && !wasActivated) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${tabId}`}
      aria-labelledby={`tab-${tabId}`}
      {...props}
      style={{ display: active ? "block" : "none" }}
    >
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
