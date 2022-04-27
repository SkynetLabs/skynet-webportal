import * as React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

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
  className: "slider-scroller grid transition-transform",
})`
  ${({ $scrollable }) => ($scrollable ? scrollableStyles : "")}
`;

const Slider = ({ slides, breakpoints, scrollerClassName, className }) => {
  const { visibleSlides, scrollable } = useActiveBreakpoint(breakpoints);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const changeSlide = React.useCallback(
    (event, index) => {
      event.preventDefault();
      event.stopPropagation();
      setActiveIndex(Math.min(index, slides.length - visibleSlides)); // Don't let it scroll too far
    },
    [slides, visibleSlides, setActiveIndex]
  );

  React.useEffect(() => {
    // Prevent negative values for activeIndex.
    const maxIndex = Math.max(slides.length - visibleSlides, 0);

    // Make sure to not scroll too far when screen size changes.
    if (activeIndex > maxIndex) {
      setActiveIndex(maxIndex);
    }
  }, [slides.length, visibleSlides, activeIndex]);

  return (
    <Container className={className}>
      <Scroller
        $visibleSlides={visibleSlides}
        $allSlides={slides.length}
        $activeIndex={activeIndex}
        $scrollable={scrollable}
        className={scrollerClassName}
      >
        {slides.map((slide, index) => {
          const isVisible = index >= activeIndex && index < activeIndex + visibleSlides;

          return (
            <div key={`slide-${index}`} className="h-full">
              <Slide
                isVisible={isVisible || !scrollable}
                onClickCapture={
                  scrollable && !isVisible
                    ? (event) => changeSlide(event, index > activeIndex ? activeIndex + 1 : activeIndex - 1)
                    : null
                }
              >
                {slide}
              </Slide>
            </div>
          );
        })}
      </Scroller>
      {scrollable && (
        <Bullets
          activeIndex={activeIndex}
          allSlides={slides.length}
          visibleSlides={visibleSlides}
          changeSlide={changeSlide}
        />
      )}
    </Container>
  );
};

Slider.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.node.isRequired),
  breakpoints: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Breakpoint name as defined in Tailwind config. If not defined, config
       * will be applied to all non-configured screen sizes.
       */
      name: PropTypes.string,
      /**
       * Number of slides visible for a given breakpoint.
       */
      visibleSlides: PropTypes.number.isRequired,
      /**
       * Whether or not the list should be scrollable horizontally at the given breakpoint.
       * If set to false, all slides will be visible & rendered in a column.
       */
      scrollable: PropTypes.bool.isRequired,
      /**
       * Additional class names to apply to the <Scroller /> element.
       */
      scrollerClassName: PropTypes.string,
      /**
       * Additional class names to apply to the <Container /> element.
       */
      className: PropTypes.string,
    })
  ),
};

Slider.defaultProps = {
  breakpoints: [
    {
      name: "xl",
      scrollable: true,
      visibleSlides: 3,
    },
    {
      name: "md",
      scrollable: true,
      visibleSlides: 2,
    },
    {
      // For the smallest screens, we won't scroll but instead stack the slides vertically.
      scrollable: false,
      visibleSlides: 1,
    },
  ],
  scrollerClassName: "gap-4",
  className: "",
};

export default Slider;
