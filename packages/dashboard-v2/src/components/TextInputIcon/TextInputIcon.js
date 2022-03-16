import PropTypes from "prop-types";
import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import { PlusIcon } from "../Icons";

export const TextInputIcon = ({ className, icon, placeholder, onChange }) => {
  const inputRef = useRef();
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  return (
    <div
      className={cn(
        "grid-flow-col inline-grid grid-cols-[2rem_1fr_1.5rem] items-center rounded-full bg-palette-100 px-4 py-2",
        className,
        {
          "outline outline-1 outline-primary": focused,
        }
      )}
    >
      <div>{icon}</div>
      <input
        ref={inputRef}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="focus:outline-none bg-transparent placeholder:text-palette-400"
      />
      {value && (
        <PlusIcon
          size={14}
          role="button"
          className="justify-self-end text-palette-400 rotate-45"
          onClick={() => setValue("")}
        />
      )}
    </div>
  );
};

TextInputIcon.propTypes = {
  /**
   * Icon to place in text input
   */
  icon: PropTypes.element.isRequired,
  /**
   * Input placeholder
   */
  placeholder: PropTypes.string,
  /**
   * Function to be called whenever value changes
   */
  onChange: PropTypes.func.isRequired,
};
