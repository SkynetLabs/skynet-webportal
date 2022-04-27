import styled from "styled-components";
import PropTypes from "prop-types";

const Slide = styled.div.attrs(({ isVisible }) => ({
  className: `slider-slide transition-opacity h-full ${isVisible ? "" : "opacity-50 cursor-pointer select-none"}`,
}))``;

Slide.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default Slide;
