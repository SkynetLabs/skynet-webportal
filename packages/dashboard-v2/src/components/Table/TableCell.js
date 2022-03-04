import styled from "styled-components";

/**
 * Accepts all HMTL attributes a `<td>` element does.
 */
export const TableCell = styled.td.attrs({
  className: `first:pl-6 last:pr-6 px-2 py-4 h-tableRow truncate
              text-palette-600 even:text-palette-400
              first:rounded-l-sm last:rounded-r-sm`,
})`
  text-align: ${({ align }) => align ?? "left"};
  max-width: ${({ maxWidth }) => maxWidth ?? "none"};
`;
