import { Children, cloneElement, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useClickAway } from "react-use";
import styled, { css, keyframes } from "styled-components";

const dropDown = keyframes`
  0% {
    transform: scaleY(0);
  }
  80% {
    transform: scaleY(1.1);
  }
  100% {
    transform: scaleY(1);
  }
`;

const Container = styled.div.attrs({ className: "relative inline-flex" })``;

const Flyout = styled.ul.attrs({
  className: `absolute right-0 z-10 py-2
              border rounded bg-white
              overflow-hidden pointer-events-none
              shadow-md shadow-palette-200/50
              pointer-events-auto h-auto overflow-visible border-primary`,
})`
  top: calc(100% + 2px);
  animation: ${css`
    ${dropDown} 0.1s ease-in-out
  `};
`;

const Option = styled.li.attrs({
  className: `font-sans text-xs uppercase
              relative pl-3 pr-5 py-1
              text-palette-600 cursor-pointer
              hover:text-primary hover:font-normal
              active:text-primary active:font-normal

              before:content-[initial] before:absolute before:left-0 before:h-3 before:w-0.5 before:bg-primary before:top-1.5
              hover:before:content-['']`,
})``;

export const PopoverMenu = ({ options, children, openClassName, ...props }) => {
  const containerRef = useRef();
  const [open, setOpen] = useState(false);

  useClickAway(containerRef, () => setOpen(false));

  const handleChoice = (callback) => () => {
    setOpen(false);
    callback();
  };

  return (
    <Container ref={containerRef} {...props}>
      {Children.only(
        cloneElement(children, {
          onClick: () => setOpen((open) => !open),
          className: `${children.props.className ?? ""} ${open ? openClassName : ""}`,
        })
      )}
      {open && (
        <Flyout>
          {options.map(({ label, callback }) => (
            <Option key={label} onClick={handleChoice(callback)}>
              {label}
            </Option>
          ))}
        </Flyout>
      )}
    </Container>
  );
};

PopoverMenu.propTypes = {
  /**
   * Accepts a single child node that will become a menu toggle.
   */
  children: PropTypes.element.isRequired,
  /**
   * Positions in the menu
   */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      callback: PropTypes.func.isRequired,
    })
  ).isRequired,
};
