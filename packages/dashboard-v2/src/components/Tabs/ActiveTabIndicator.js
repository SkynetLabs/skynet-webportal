import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useWindowSize } from "react-use";

const Wrapper = styled.div.attrs({
  className: "absolute left-0 bottom-0 w-full h-0.5 bg-palette-200",
})``;

const Indicator = styled.div.attrs({
  className: "absolute h-0.5 bottom-0 bg-primary duration-200 ease-in-out",
})`
  will-change: left, width;
`;

export const ActiveTabIndicator = ({ tabRef }) => {
  const [position, setPosition] = useState(0);
  const [width, setWidth] = useState(0);
  const { width: windowWidth } = useWindowSize();

  useEffect(() => {
    if (!tabRef?.current) {
      return;
    }

    const { offsetLeft, offsetWidth } = tabRef.current;
    setPosition(offsetLeft);
    setWidth(offsetWidth);
  }, [tabRef, windowWidth]);

  return (
    <Wrapper>
      <Indicator style={{ left: position, width: `${width}px` }} />
    </Wrapper>
  );
};

// Needed, because we're using an Element constant here which Gatsby doesn't recognize during build time.
if (typeof window !== "undefined") {
  ActiveTabIndicator.propTypes = {
    tabRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.instanceOf(Element) })]),
  };
}
