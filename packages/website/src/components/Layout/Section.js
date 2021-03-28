import * as React from "react";
import classnames from "classnames";

export const Section = ({ children, className, ...props }) => (
  <div className={classnames("px-8 py-16 desktop:py-32", className)} {...props}>
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

export const CardWithTitle = ({ Icon, title }) => (
  <div className="flex flex-col items-center">
    <Icon height="142" />
    <p className="text-center mt-4 font-light text-palette-600 text-lg">{title}</p>
  </div>
);

const Label = ({ children }) => (
  <span className="inline-flex items-center px-3 leading-5 rounded-full text-xxs bg-palette-200 text-palette-600 lowercase">
    {children}
  </span>
);

export const CardWithDescription = ({ Icon, label, title, text }) => (
  <div className="flex flex-col">
    <div className="flex items-center space-x-4">
      <Icon />
      {label && <Label>{label}</Label>}
    </div>
    <h3 className="font-light text-lg mt-6">{title}</h3>
    <p className="text-palette-400 font-content mt-6">{text}</p>
  </div>
);
