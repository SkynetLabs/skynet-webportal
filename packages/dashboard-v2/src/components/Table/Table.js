import styled from "styled-components";

const Container = styled.div.attrs({
  className: "p-1 max-w-full",
})``;

const StyledTable = styled.table.attrs({
  className: "table-auto w-full border-separate",
})`
  border-spacing: 0;
`;

/**
 * Accepts all HMTL attributes a `<table>` element does.
 */
export const Table = (props) => (
  <Container>
    <StyledTable {...props} />
  </Container>
);
