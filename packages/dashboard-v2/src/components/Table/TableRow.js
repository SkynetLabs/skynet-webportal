import PropTypes from "prop-types";
import styled from "styled-components";

/**
 * Besides documented props, it accepts all HMTL attributes a `<tr>` element does.
 */
export const TableRow = styled.tr.attrs(({ noHoverEffect }) => ({
  className: `bg-palette-100/50 odd:bg-white ${noHoverEffect ? "" : "hover:bg-palette-200/20"}`,
}))``;

/**
 * Allows disabling `hover` effect on a row. Useful for `<thead>` row.
 */
TableRow.propTypes = {
  noHoverEffect: PropTypes.bool,
};

TableRow.defaultProps = {
  noHoverEffect: false,
};
