import * as React from "react";
import classnames from "classnames";

export default function Grid({ cols, columns }) {
  return (
    <div
      className={classnames("grid grid-cols-1 gap-y-16 ", {
        "desktop:grid-cols-2 gap-x-32": cols === 2,
        "desktop:grid-cols-3 gap-x-16": cols === 3,
      })}
    >
      {children}
    </div>
  );
}
