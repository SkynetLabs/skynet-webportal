import { useRef, useState } from "react";
import { useClickAway } from "react-use";
import PropTypes from "prop-types";
import styled, { css, keyframes } from "styled-components";

import { ChevronDownIcon } from "../Icons";

const dropDown = keyframes`
  0% {
    transform: rotateX(-90deg);
  }
  100% {
    transform: rotateX(0deg);
  }
`;

const Container = styled.div.attrs({ className: `relative inline-flex` })``;

const Trigger = styled.button.attrs({
  className: "flex items-center",
})``;

const TriggerIcon = styled(ChevronDownIcon).attrs({
  className: "transition-transform text-primary",
})`
  transform: ${({ open }) => (open ? "rotateX(180deg)" : "none")};
`;

const Flyout = styled.div.attrs(({ open }) => ({
  className: `absolute top-full right-0 p-0 z-10
              border rounded border-palette-100
              bg-white shadow-md shadow-palette-200/50
              ${open ? "visible" : "invisible"}`,
}))`
  transform-origin: top center;
  animation: ${({ open }) =>
    open
      ? css`
          ${dropDown} .15s ease-in-out forwards;
        `
      : "none"};
`;

export const DropdownMenu = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useClickAway(menuRef, () => setOpen(false));

  return (
    <Container ref={menuRef}>
      <Trigger onClick={() => setOpen((open) => !open)}>
        {title} <TriggerIcon open={open} />
      </Trigger>
      <Flyout open={open}>{children}</Flyout>
    </Container>
  );
};

DropdownMenu.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
