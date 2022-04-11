import { createContext } from "react";

export const PlansContext = createContext({
  plans: [],
  limits: [],
  error: null,
});
