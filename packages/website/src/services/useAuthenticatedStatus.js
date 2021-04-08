import useSWR from "swr";

export default function useAuthenticatedStatus() {
  return useSWR("/__internal/do/not/use", (url) => fetch(url).then((response) => response.json()));
}
