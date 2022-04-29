const hostname = typeof window !== "undefined" ? window.location.hostname : "";
const domain = hostname.substring(hostname.lastIndexOf(".", hostname.lastIndexOf(".") - 1) + 1);
const emails = {
  contact: `hello@${domain}`, // general contact email
  report: `report@${domain}`, // report abuse email
};

export default emails;
