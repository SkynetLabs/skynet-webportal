import useSWR from "swr";

const prefix = process.env.GATSBY_API_URL ?? "";
const fetcher = (url) =>
  fetch(`${prefix}${url}`)
    .then((response) => response.json())
    // temporary backwards compatibility code until new nginx code is deployed
    .catch((error) => console.log(error) || fetcher(url.replace("/accounts", "/authenticated")));

export default function useAccounts() {
  return useSWR("/__internal/do/not/use/accounts", fetcher);
}
