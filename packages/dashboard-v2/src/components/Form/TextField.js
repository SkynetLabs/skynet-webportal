import PropTypes from "prop-types";
import cn from "classnames";
import { Field } from "formik";

export const TextField = ({ id, label, name, error, touched, ...props }) => {
  return (
    <div className="flex flex-col w-full gap-1">
      {label && (
        <label className="font-sans uppercase text-palette-300 text-xs" htmlFor={id}>
          {label}
        </label>
      )}
      <Field
        id={id}
        name={name}
        className={cn("w-full py-2 px-4 bg-palette-100 rounded-sm placeholder:text-palette-200 outline-1", {
          "focus:outline outline-palette-200": !error || !touched,
          "outline outline-error": touched && error,
        })}
        {...props}
      />
      {touched && error && (
        <div className="text-error">
          <small>{error}</small>
        </div>
      )}
    </div>
  );
};

/** Besides noted properties, it accepts all props accepted by:
 *  - a regular <input> element
 *  - Formik's <Field> component
 */
TextField.propTypes = {
  /**
   * ID for the field. Used to couple <label> and <input> elements
   */
  id: PropTypes.string,
  /**
   * Label for the field
   */
  label: PropTypes.string,
  /**
   * Name of the field
   */
  name: PropTypes.string.isRequired,
  /**
   * Validation error message
   */
  error: PropTypes.string,
  /**
   * Indicates wether or not the user touched the field already.
   */
  touched: PropTypes.bool,
};
