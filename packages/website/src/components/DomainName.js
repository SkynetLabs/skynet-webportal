import * as React from "react";

import { useDomain } from "../hooks/useDomain";

export const DomainName = () => {
  const domain = useDomain();

  return <span className="capitalize">{domain}</span>;
};
