export const useDomain = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const { hostname } = window.location;

  return hostname.substring(hostname.lastIndexOf(".", hostname.lastIndexOf(".") - 1) + 1);
};
