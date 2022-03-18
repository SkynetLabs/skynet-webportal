import styled from "styled-components";
import PropTypes from "prop-types";

const DropdownLink = styled.a.attrs({
  className: `m-0 border-t border-palette-200/50 h-[60px]
              whitespace-nowrap transition-colors
              hover:bg-palette-100/50 flex items-center
              pr-8 pl-6 py-4 gap-4 first:border-0`,
})``;

export const DropdownMenuLink = ({ active, icon: Icon, label, ...props }) => (
  <DropdownLink {...props}>
    {Icon ? <Icon /> : null}
    <span className="text-palette-500">{label}</span>
  </DropdownLink>
);

DropdownMenuLink.propTypes = {
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  active: PropTypes.bool,
  icon: PropTypes.func,
};
