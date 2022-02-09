import useSWR from "swr";
import { useRouter } from "next/router";
import { StatusCodes } from "http-status-codes";

const prefix = process.env.NEXT_PUBLIC_PORTAL_DOMAIN ? `https://account.${process.env.NEXT_PUBLIC_PORTAL_DOMAIN}` : "";

const fetcher = (url, router) => {
  return fetch(url).then((res) => {
    if (res.status === StatusCodes.UNAUTHORIZED) {
      router.push(`/auth/login?return_to=${encodeURIComponent(window.location.href)}`);
    }

    return res.json();
  });
};

export default function useAccountsApi(key, config) {
  const router = useRouter();

  return useSWR(`${prefix}/api/${key}`, (url) => fetcher(url, router), config);
}
