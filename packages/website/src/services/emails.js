const hostname = typeof window !== "undefined" ? window.location.hostname : "";
const domain = hostname.substring(hostname.lastIndexOf(".", hostname.lastIndexOf(".") - 1) + 1);
const emails = {
  contact: process.env.WEBSITE_CONTACT_EMAIL ?? `hello@${domain}`, // general contact email
  report: process.env.WEBSITE_ABUSE_EMAIL ?? `report@${domain}`, // report abuse email
};

export default emails;
