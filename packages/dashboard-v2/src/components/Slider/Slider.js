import * as React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import theme from "../../lib/theme";

import useActiveBreakpoint from "./useActiveBreakpoint";
import Bullets from "./Bullets";
import Slide from "./Slide";

const Container = styled.div.attrs({
  className: "slider w-full",
})``;

/**
 * Styles applied to the movable element when the number of slide elements
 * exceeds the number of visible slides for the current breakpoint
 * */
const scrollableStyles = css`
  ${({ $allSlides, $visibleSlides, $activeIndex }) => `
    transform: translateX(calc(-1 * ${$activeIndex} * ((100% + 1rem) / ${$visibleSlides})));
    grid-template-columns: repeat(${$allSlides}, calc((100% - ${$visibleSlides - 1}rem) / ${$visibleSlides}));
  `}
`;

const Scroller = styled.div.attrs({
  className: "slider-scroller grid gap-4 transition-transform",
})`
  ${({ $scrollable }) => ($scrollable ? scrollableStyles : "")}
`;

const Slider = ({ slides, breakpoints }) => {
  const { visibleSlides, scrollable } = useActiveBreakpoint(breakpoints);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const changeSlide = React.useCallback(
    (index) => {
      setActiveIndex(Math.min(index, slides.length - visibleSlides)); // Don't let it scroll too far
    },
    [slides, visibleSlides, setActiveIndex]
  );

  return (
    <Container>
      <Scroller
        $visibleSlides={visibleSlides}
        $allSlides={slides.length}
        $activeIndex={activeIndex}
        $scrollable={scrollable}
      >
        {slides.map((slide, i) => {
          const isVisible = i >= activeIndex && i < activeIndex + visibleSlides;

          return (
            <div key={`slide-${i}`}>
              <Slide
                isVisible={isVisible || !scrollable}
                onClick={scrollable && !isVisible ? () => changeSlide(i) : null}
              >
                {slide}
              </Slide>
            </div>
          );
        })}
      </Scroller>
      <Bullets
        activeIndex={activeIndex}
        allSlides={slides.length}
        visibleSlides={visibleSlides}
        changeSlide={changeSlide}
      />
    </Container>
  );
};

Slider.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.node.isRequired),
  breakpoints: PropTypes.arrayOf(
    PropTypes.shape({
      minWidth: PropTypes.number.isRequired,
      visibleSlides: PropTypes.number.isRequired,
    })
  ),
};

Slider.defaultProps = {
  breakpoints: [
    {
      minWidth: parseInt(theme.screens.xl),
      scrollable: true,
      visibleSlides: 3,
    },
    {
      minWidth: parseInt(theme.screens.md, 10),
      scrollable: true,
      visibleSlides: 2,
    },
    {
      // For the smallest screens, we won't scroll but instead stack the slides vertically.
      minWidth: -Infinity,
      scrollable: false,
      visibleSlides: 1,
    },
  ],
};

export default Slider;