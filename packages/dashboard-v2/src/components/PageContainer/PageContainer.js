import PropTypes from "prop-types";
import styled from "styled-components";

export const PageContainer = styled.div.attrs({
  className: `mx-auto w-page lg:w-page-lg xl:w-page-xl px-2 md:px-16 lg:px-0`,
})``;

PageContainer.propTypes = {
  /**
   * Optional `class` attribute.
   */
  className: PropTypes.string,
};
