import PropTypes from "prop-types";
import styled from "styled-components";

export const NavBarLink = styled.a.attrs(({ active }) => ({
  className: `
    sm:min-w-[133px] lg:min-w-[168px]
    flex h-full items-center justify-center
    border-x border-x-palette-100 border-b-2
    text-palette-600 transition-colors hover:bg-palette-100/50
    ${active ? "border-b-primary" : "border-b-palette-200/50"}
  `,
}))``;

NavBarLink.propTypes = {
  /**
   * When set to true, an additional indicator will be rendered showing the item as active.
   */
  active: PropTypes.bool,
};
