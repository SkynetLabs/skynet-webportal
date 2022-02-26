import { useEffect, useMemo, useCallback, useState } from "react";
import { useWindowSize } from "react-use";

import theme from "../../lib/theme";

const { screens } = theme;

export default function useActiveBreakpoint(breakpoints) {
  const { width: windowWidth } = useWindowSize();
  const monitoredBreakpoints = useMemo(
    () =>
      breakpoints
        .slice()
        // Map breakpoint names to their min-width configured in Tailwind
        .map(({ name, ...config }) => {
          // If breakpoint name is not configured,
          // we'll apply this config to all unmatched breakpoints.
          const minWidth = screens[name] ? parseInt(screens[name], 10) : -Infinity;

          return { minWidth, ...config };
        })
        // Since our breakpoints are setup with min-width rule, we need to sort them from largest to smallest
        .sort(({ minWidth: widthA }, { minWidth: widthB }) => widthB - widthA),
    [breakpoints]
  );
  const findActiveBreakpoint = useCallback(
    () => monitoredBreakpoints.find((breakpoint) => windowWidth >= breakpoint.minWidth),
    [monitoredBreakpoints, windowWidth]
  );

  const [activeBreakpoint, setActiveBreakpoint] = useState(findActiveBreakpoint());

  useEffect(() => {
    setActiveBreakpoint(findActiveBreakpoint());
  }, [findActiveBreakpoint]);

  return activeBreakpoint;
}
