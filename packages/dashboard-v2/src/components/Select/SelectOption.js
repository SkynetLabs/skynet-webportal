import PropTypes from "prop-types";
import styled from "styled-components";

const Option = styled.li.attrs(({ selected }) => ({
  className: `m-0 px-4 whitespace-nowrap py-1 px-4 cursor-pointer
              transition-colors hover:bg-palette-100/50
              ${selected ? "pl-3.5 border-l-2 border-l-primary" : ""}`,
}))``;

export const SelectOption = ({ selected, label, ...props }) => (
  <Option selected={selected} role="option" {...props}>
    {label}
  </Option>
);

SelectOption.propTypes = {
  /**
   * Label for the option
   */
  label: PropTypes.string.isRequired,

  /** Value represented by the option */
  value: PropTypes.string.isRequired,

  /**
   * Indicates an option is currently selected. **Controlled by parent `<Select>` component**.
   */
  selected: PropTypes.bool,
};
