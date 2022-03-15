import { nanoid } from "nanoid";
import PropTypes from "prop-types";
import { useMemo } from "react";

export const TextInputBasic = ({ label, placeholder, ...props }) => {
  const id = useMemo(() => `input-${nanoid()}`, []);

  return (
    <div className="flex flex-col w-full gap-1">
      <label className="font-sans uppercase text-palette-300 text-xs" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        placeholder={placeholder}
        className="w-full py-2 px-4 bg-palette-100 rounded-sm placeholder:text-palette-200 focus:outline outline-1 outline-palette-200"
        {...props}
      />
    </div>
  );
};

TextInputBasic.propTypes = {
  /**
   * Icon to place in text input
   */
  label: PropTypes.string,
  /**
   * Input placeholder
   */
  placeholder: PropTypes.string,
};
