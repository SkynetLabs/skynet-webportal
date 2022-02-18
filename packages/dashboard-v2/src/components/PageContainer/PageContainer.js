import PropTypes from "prop-types";
import styled from "styled-components";

export const PageContainer = styled.div.attrs({
  className: `mx-auto w-page md:w-page-md lg:w-page-lg xl:w-page-xl`,
})``;

PageContainer.propTypes = {
  /**
   * Optional `class` attribute.
   */
  className: PropTypes.string,
};
