import { cloneElement, useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { ActiveTabIndicator } from "./ActiveTabIndicator";
import { usePrefixedTabIds, useTabsChildren } from "./hooks";

const Container = styled.div.attrs({
  className: "tabs-container flex flex-col h-full",
})``;

const Header = styled.div.attrs({
  className: "relative flex justify-start overflow-hidden grow-0 shrink-0",
})``;

const TabList = styled.div.attrs(({ variant }) => ({
  role: "tablist",
  className: `relative inline-grid grid-flow-col auto-cols-fr
              ${variant === "regular" ? "w-full sm:w-auto" : "w-full"}`,
}))``;

const Divider = styled.div.attrs({
  "aria-hidden": "true",
  className: "absolute bottom-0 w-screen border-b border-b-palette-200",
})`
  right: calc(-100vw - 2px);
`;

const Body = styled.div.attrs({ className: "grow min-h-0" })``;

/**
 * Besides documented props, it accepts all HMTL attributes a `<div>` element does.
 */
export const Tabs = ({ defaultTab, children, variant }) => {
  const getTabId = usePrefixedTabIds();
  const { tabs, panels, tabsRefs } = useTabsChildren(children, getTabId);
  const defaultTabId = useMemo(() => {
    const requestedTabIsPresent = tabs.find(({ props }) => props.id === defaultTab);

    return getTabId(requestedTabIsPresent ? defaultTab : tabs[0].props.id);
  }, [getTabId, defaultTab, tabs]);
  const [activeTabId, setActiveTabId] = useState(defaultTabId);
  const [activeTabRef, setActiveTabRef] = useState(tabsRefs[activeTabId]);
  const isActive = (id) => id === activeTabId;
  const onTabChange = useCallback(
    (id) => {
      setActiveTabId(id);
    },
    [setActiveTabId]
  );

  useEffect(() => {
    // Refresh active tab indicator whenever active tab changes.
    setActiveTabRef(tabsRefs[activeTabId]);
  }, [setActiveTabRef, tabsRefs, activeTabId]);

  return (
    <Container>
      <Header>
        <TabList variant={variant}>
          {tabs.map((tab) => {
            const tabId = getTabId(tab.props.id);

            return cloneElement(tab, {
              ref: tabsRefs[tabId],
              id: tabId,
              variant,
              active: isActive(tabId),
              onClick: () => onTabChange(tabId),
            });
          })}
          <Divider />
          <ActiveTabIndicator tabRef={activeTabRef} />
        </TabList>
      </Header>
      <Body>
        {panels.map((panel) => {
          const tabId = getTabId(panel.props.tabId);

          return cloneElement(panel, {
            ...panel.props,
            tabId,
            active: isActive(tabId),
          });
        })}
      </Body>
    </Container>
  );
};

Tabs.propTypes = {
  /**
   * Should include `<Tab />` and `<TabPanel />` components.
   */
  children: PropTypes.node.isRequired,
  /**
   * ID of the `<Tab />` which should be open by default
   */
  defaultTab: PropTypes.string,
  /**
   * `regular` (default) will make the tabs only take as much space as they need
   *
   * `fill` will make the tabs spread throughout the available width
   */
  variant: PropTypes.oneOf(["regular", "fill"]),
};

Tabs.defaultProps = {
  variant: "regular",
};
