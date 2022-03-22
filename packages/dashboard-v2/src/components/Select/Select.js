import { Children, cloneElement, useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { useClickAway } from "react-use";
import styled, { css, keyframes } from "styled-components";

import { ChevronDownIcon } from "../Icons";
import { useCallbacks, useSelectReducer } from "./hooks";
import { SelectOption } from "./SelectOption";

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

const Trigger = styled.button.attrs(({ $placeholder }) => ({
  className: `flex items-center cursor-pointer font-bold ${$placeholder ? "text-palette-300" : ""}`,
}))`
  text-transform: inherit;
`;

const TriggerIcon = styled(ChevronDownIcon).attrs({
  className: "transition-transform text-primary",
})`
  transform: ${({ open }) => (open ? "rotateX(180deg)" : "none")};
`;

const Flyout = styled.ul.attrs(({ open }) => ({
  className: `absolute right-0 z-10
              p-0 border rounded bg-white
              overflow-hidden pointer-events-none
              shadow-md shadow-palette-200/50
              ${open ? "pointer-events-auto h-auto overflow-visible border-primary" : ""}
              ${open ? "visible" : "invisible"}`,
}))`
  top: calc(100% + 2px);
  animation: ${({ open }) =>
    open
      ? css`
          ${dropDown} 0.1s ease-in-out
        `
      : "none"};
`;

export const Select = ({ defaultValue, children, onChange, placeholder, ...props }) => {
  const selectRef = useRef();
  const options = useMemo(() => Children.toArray(children).filter(({ type }) => type === SelectOption), [children]);
  const [state, dispatch] = useSelectReducer({ defaultValue, placeholder, options });
  const { close, toggle, selectOption } = useCallbacks(state, dispatch);

  useClickAway(selectRef, close);

  useEffect(() => {
    if (state.selectedOptionIndex > -1) {
      onChange(options[state.selectedOptionIndex].props.value);
    }
  }, [onChange, options, state.selectedOptionIndex]);

  const activeOption = options[state.selectedOptionIndex];
  const activeLabel = activeOption?.props?.label ?? null;

  return (
    <Container ref={selectRef} {...props}>
      <Trigger $placeholder={!activeLabel && placeholder} onClick={toggle} className={state.open ? "text-primary" : ""}>
        {activeLabel ?? placeholder} <TriggerIcon open={state.open} />
      </Trigger>
      <Flyout role="listbox" open={state.open}>
        {options.map((item, index) =>
          cloneElement(item, {
            ...item.props,
            onClick: () => selectOption(index),
            selected: state.selectedOptionIndex === index,
          })
        )}
      </Flyout>
    </Container>
  );
};

Select.propTypes = {
  /**
   * `<SelectOption>` elements.
   */
  children: PropTypes.node.isRequired,
  /**
   * Default value to be selected upon rendering.
   */
  defaultValue: PropTypes.string,
  /**
   * Callback for every change.
   */
  onChange: PropTypes.func,
  /**
   * Placeholder to be displayed when no option is selected.
   */
  placeholder: PropTypes.string,
};
