import * as React from "react";
import classnames from "classnames";

export const Section = ({ children, className, ...props }) => (
  <div className={classnames("p-8", className)} {...props}>
    <div className="max-w-content mx-auto">{children}</div>
  </div>
);

export const SectionTitle = ({ children, className, ...props }) => (
  <h2 className={classnames("text-3xl desktop:text-4xl font-semibold", className)} {...props}>
    {children}
  </h2>
);

export const SectionTitleCaption = ({ children, className, ...props }) => (
  <h6 className={classnames("text-xs uppercase my-3", className)} {...props}>
    {children}
  </h6>
);
