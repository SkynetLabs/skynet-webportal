import styled from "styled-components";
import { CircledProgressIcon } from "../Icons";

/**
 * This loading indicator is designed to be replace entire blocks (i.e. components)
 * while they are fetching required data.
 *
 * It will take 50% of the parent's height, but won't get bigger than 150x150 px.
 */
const Wrapper = styled.div.attrs({
  className: "flex w-full h-full justify-center items-center p-8 text-palette-100",
})``;

export const ContainerLoadingIndicator = (props) => (
  <Wrapper {...props}>
    <CircledProgressIcon size="50%" className="max-w-[150px] max-h-[150px] animate-[spin_3s_linear_infinite]" />
  </Wrapper>
);
