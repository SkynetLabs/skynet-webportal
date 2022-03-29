import { navigate } from "gatsby";
import { StatusCodes } from "http-status-codes";

// TODO: portal-aware URL
const baseUrl = process.env.NODE_ENV !== "production" ? "/api" : "https://account.skynetpro.net/api";

const redirectUnauthenticated = (key) =>
  fetch(`${baseUrl}/${key}`).then((response) => {
    if (response.status === StatusCodes.UNAUTHORIZED) {
      navigate(`/auth/login?return_to=${encodeURIComponent(window.location.href)}`);
      return null;
    }

    return response.json();
  });

const redirectAuthenticated = (key) =>
  fetch(`${baseUrl}/${key}`).then(async (response) => {
    if (response.ok) {
      await navigate("/");
      return response.json();
    }

    // If there was an error, let's throw so useSWR's "error" property is populated instead "data".
    const data = await response.json();
    throw new Error(data?.message || `Error occured when trying to fetch: ${key}`);
  });

export const allUsers = {
  fetcher: (key) => fetch(`${baseUrl}/${key}`).then((response) => response.json()),
};

export const authenticatedOnly = {
  fetcher: redirectUnauthenticated,
};

export const guestsOnly = {
  fetcher: redirectAuthenticated,
};
