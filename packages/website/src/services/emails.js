const emails = {
  contact: process.env.WEBSITE_CONTACT_EMAIL ?? `hello@${process.env.PORTAL_DOMAIN}`, // general contact email
  report: process.env.WEBSITE_ABUSE_EMAIL ?? `report@${process.env.PORTAL_DOMAIN}`, // report abuse email
};

export default emails;
