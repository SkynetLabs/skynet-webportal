import styled from "styled-components";

/**
 * Accepts all HMTL attributes a `<th>` element does.
 */
export const TableHeadCell = styled.th.attrs({
  className: `first:pl-6 last:pr-6 px-2 py-4
              truncate h-tableRow
              text-palette-600 font-sans font-light text-xs
              first:rounded-l-sm last:rounded-r-sm`,
})`
  text-align: ${({ align }) => align ?? "left"};
  max-width: ${({ maxWidth }) => maxWidth ?? "none"};
`;
