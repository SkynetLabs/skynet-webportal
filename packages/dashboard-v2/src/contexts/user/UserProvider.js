import { useEffect, useState } from "react";
import useSWRImmutable from "swr/immutable";

import { UserContext } from "./UserContext";

export const UserProvider = ({ children }) => {
  const { data: user, error, mutate } = useSWRImmutable("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user || error) {
      setLoading(false);
    }
  }, [user, error]);

  return <UserContext.Provider value={{ user, error, loading, mutate }}>{children}</UserContext.Provider>;
};
