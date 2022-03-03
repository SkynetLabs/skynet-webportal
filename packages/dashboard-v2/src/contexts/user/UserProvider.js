import { useEffect, useState } from "react";
import useSWR from "swr";

import { UserContext } from "./UserContext";

export const UserProvider = ({ children }) => {
  const { data: user, error, mutate } = useSWR("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user || error) {
      setLoading(false);
    }
  }, [user, error]);

  return <UserContext.Provider value={{ user, error, loading, mutate }}>{children}</UserContext.Provider>;
};
