import { Children, createRef, useCallback, useMemo } from "react";

import { Tab } from "./Tab";
import { TabPanel } from "./TabPanel";

export const usePrefixedTabIds = () => {
  const seed = useMemo(() => Math.random().toString().split(".")[1], []);

  return useCallback((id) => `${seed}-${id}`, [seed]);
};

export const useTabsChildren = (children, prefixId) => {
  const childrenArray = useMemo(() => Children.toArray(children), [children]);
  const tabs = useMemo(() => childrenArray.filter(({ type }) => type === Tab), [childrenArray]);
  const panels = useMemo(() => childrenArray.filter(({ type }) => type === TabPanel), [childrenArray]);
  const tabsRefs = useMemo(
    () =>
      tabs.reduce(
        (refs, tab) => ({
          ...refs,
          [prefixId(tab.props.id)]: createRef(),
        }),
        {}
      ),
    [tabs, prefixId]
  );

  return {
    tabs,
    panels,
    tabsRefs,
  };
};
