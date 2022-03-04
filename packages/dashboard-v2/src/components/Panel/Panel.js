import PropTypes from "prop-types";
import styled from "styled-components";

const PanelBody = styled.div.attrs({
  className: "p-6 bg-white rounded",
})``;

const PanelTitle = styled.h6.attrs({
  className: "uppercase text-xs text-palette-400 h-8 flex items-center",
})``;

/**
 * Besides documented props, it accepts all HMTL attributes a `<div>` element does.
 *
 * These additional props will be rendered onto the panel's body element.
 */
export const Panel = ({ title, ...props }) => (
  <div>
    {title && <PanelTitle>{title}</PanelTitle>}
    <PanelBody {...props} />
  </div>
);

Panel.propTypes = {
  /**
   * Label of the panel
   */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

Panel.defaultProps = {
  title: "",
};
