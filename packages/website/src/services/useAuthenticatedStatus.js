import useSWR from "swr";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function useAuthenticatedStatus() {
  return useSWR("/__internal/do/not/use/authenticated", fetcher);
}
