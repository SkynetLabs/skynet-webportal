import { navigate } from "gatsby";
import { useEffect, useState } from "react";
import useSWRImmutable from "swr/immutable";
import { UnauthorizedError } from "../../lib/swrConfig";

import { UserContext } from "./UserContext";

export const UserProvider = ({ children, allowGuests = false, allowAuthenticated = true }) => {
  const { data: user, error, mutate } = useSWRImmutable("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      if (!allowAuthenticated) {
        navigate("/");
      } else {
        setLoading(false);
      }
    } else if (error) {
      if (error instanceof UnauthorizedError && !allowGuests) {
        navigate(`/auth/login?return_to=${encodeURIComponent(window.location.href)}`);
      } else {
        setLoading(false);
      }
    }
  }, [user, error, allowGuests, allowAuthenticated]);

  return <UserContext.Provider value={{ user, error, loading, mutate }}>{children}</UserContext.Provider>;
};
