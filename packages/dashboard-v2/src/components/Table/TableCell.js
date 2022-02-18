import styled from "styled-components";

/**
 * Accepts all HMTL attributes a `<td>` element does.
 */
export const TableCell = styled.td.attrs({
  className: `px-6 py-4 h-tableRow truncate
              text-palette-600 even:text-palette-400
              first:rounded-l-sm last:rounded-r-sm`,
})`
  text-align: ${({ align }) => align ?? "left"};
  max-width: ${({ maxWidth }) => maxWidth ?? "none"};
`;
