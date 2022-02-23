import { useEffect, useMemo, useCallback, useState } from "react";
import { useWindowSize } from "react-use";

export default function useActiveBreakpoint(breakpoints) {
  const { width: windowWidth } = useWindowSize();
  // Since our breakpoints are setup with min-width rule, we need to sort them from largest to smallest
  const monitoredBreakpoints = useMemo(
    () => breakpoints.slice().sort(({ minWidth: widthA }, { minWidth: widthB }) => widthB - widthA),
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
