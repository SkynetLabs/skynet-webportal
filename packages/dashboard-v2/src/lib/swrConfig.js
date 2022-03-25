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
  fetch(`${baseUrl}/${key}`).then((response) => {
    if (response.status === StatusCodes.OK) {
      navigate(`/`);
    }

    return response.json();
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
