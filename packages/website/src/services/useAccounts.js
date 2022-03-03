import useSWR from "swr";

const prefix = process.env.GATSBY_API_URL ?? "";
const fetcher = (url) => fetch(`${prefix}${url}`).then((response) => response.json());

export default function useAccounts() {
  return useSWR("/__internal/do/not/use/accounts", fetcher);
}
