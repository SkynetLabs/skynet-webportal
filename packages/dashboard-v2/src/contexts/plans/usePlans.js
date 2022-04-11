import { useContext } from "react";

import { PlansContext } from "./PlansContext";

export const usePlans = () => useContext(PlansContext);
