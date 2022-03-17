import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { nanoid } from "nanoid";

const Container = styled.div.attrs({
  className: "inline-flex items-center gap-1 cursor-pointer select-none",
})``;

const Checkbox = styled.input.attrs({
  type: "checkbox",
  className: `h-0 w-0 hidden`,
})``;

const Label = styled.label.attrs({
  className: "cursor-pointer inline-flex items-center gap-2",
})`
  &:active .toggle-pin {
    width: 20px;
  }
`;

const Toggle = styled.span.attrs({
  className: `flex flex-row items-center justify-between shrink-0
              w-[44px] h-[22px] bg-white rounded-full
              border border-palette-200 relative cursor-pointer`,
})`
  &:active .toggle-pin {
    width: 20px;
  }
`;

const TogglePin = styled.span.attrs(({ $checked }) => ({
  className: `toggle-pin
              absolute top-[2px] w-4 h-4 rounded-full
              transition-[width_left] active:w-5

              ${$checked ? "checked bg-primary" : "bg-palette-200"}`,
}))`
  left: 2px;

  &.checked {
    left: calc(100% - 2px);
    transform: translateX(-100%);
  }
`;

export const Switch = ({ children, defaultChecked, labelClassName, onChange, ...props }) => {
  const id = useMemo(nanoid, [onChange]);
  const [checked, setChecked] = useState(defaultChecked);

  useEffect(() => {
    onChange(checked);
  }, [checked, onChange]);

  return (
    <Container {...props}>
      <Checkbox checked={checked} onChange={(ev) => setChecked(ev.target.checked)} id={id} />
      <Label htmlFor={id} className={labelClassName}>
        <Toggle>
          <TogglePin $checked={checked} />
        </Toggle>
        <div className="-mt-0.5">{children}</div>
      </Label>
    </Container>
  );
};

Switch.propTypes = {
  /**
   * Should the checkbox be checked by default?
   */
  defaultChecked: PropTypes.bool,
  /**
   * Element to be rendered as the switch label
   */
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  /**
   * Pass additional CSS classes to the `label` element.
   */
  labelClassName: PropTypes.string,
  /**
   * Function to execute on change
   */
  onChange: PropTypes.func.isRequired,
};

Switch.defaultProps = {
  defaultChecked: false,
  labelClassName: "",
};
