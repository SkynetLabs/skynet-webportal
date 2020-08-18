import React from "react";
import classNames from "classnames";

import "./Button.scss";

export default function Button({ href, type, children, full, className, iconLeft, iconRight, ...rest }) {
  const classes = classNames("button", { iconLeft, iconRight, full }, className);

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  } else if (type) {
    return (
      <button type={type} className={classes} {...rest}>
        {children}
      </button>
    );
  } else {
    return (
      <button type="button" className={classes} {...rest}>
        {children}
      </button>
    );
  }
}
