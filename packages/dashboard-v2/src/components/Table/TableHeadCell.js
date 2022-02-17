import styled from 'styled-components'

/**
 * Accepts all HMTL attributes a `<th>` element does.
 */
export const TableHeadCell = styled.th.attrs({
  className: `px-6 py-2.5 truncate h-tableRow
              text-palette-600 font-sans font-light text-xs
              first:rounded-l-sm last:rounded-r-sm`,
})`
  text-align: ${({ align }) => align ?? 'left'};
  max-width: ${({ maxWidth }) => maxWidth ?? 'none'};
`
