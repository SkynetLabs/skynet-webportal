import useSWR from "swr";
import { StatusCodes } from "http-status-codes";

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (res.status === StatusCodes.FORBIDDEN) {
      window.location.href = `/auth/login?return_to=${encodeURIComponent(window.location.href)}`;
    }

    return res.json();
  });

export default function useAccountsApi(key, config) {
  return useSWR(key, fetcher, config);
}
