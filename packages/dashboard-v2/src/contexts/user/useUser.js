import { useContext } from "react";

import { UserContext } from "./UserContext";

export const useUser = () => useContext(UserContext);
