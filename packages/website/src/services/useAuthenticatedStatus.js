import useSWR from "swr";

export default function useAuthenticatedStatus() {
  return useSWR("/__internal/do/not/use", (url) => (await fetch(url)).json());
}
