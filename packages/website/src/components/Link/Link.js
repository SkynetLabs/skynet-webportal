import * as React from "react";
import { Link as GatsbyLink } from "gatsby";

export default function Link({ children, to, activeClassName, partiallyActive, ...params }) {
  if (to) {
    return (
      <GatsbyLink to={to} activeClassName={activeClassName} partiallyActive={partiallyActive} {...params}>
        {children}
      </GatsbyLink>
    );
  }

  return <a {...params}>{children}</a>;
}
