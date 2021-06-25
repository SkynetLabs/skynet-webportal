const dns = require("dns");
const express = require("express");
const NodeCache = require("node-cache");
const isValidDomain = require("is-valid-domain");

const host = process.env.HOSTNAME || "0.0.0.0";
const port = Number(process.env.PORT) || 3100;

const server = express();
const cache = new NodeCache({ stdTTL: 300 }); // cache for 5 minutes

const dnslinkRegExp = /^dnslink=.+$/;
const skylinkDnslinkRegExp = /^dnslink=\/skynet-ns\/([a-zA-Z0-9_-]{46}|[a-z0-9]{55})/;
const hint = "valid example: dnslink=/skynet-ns/3ACpC9Umme41zlWUgMQh1fw0sNwgWwyfDDhRQ9Sppz9hjQ";

server.get("/dnslink/:name", async (req, res) => {
  const success = (skylink) => res.set("Skynet-Skylink", skylink).send(skylink);
  const failure = (message) => res.status(400).set("Dnslink-Error", message).send(message);

  if (!isValidDomain(req.params.name)) {
    return failure(`"${req.params.name}" is not a valid domain`);
  }

  if (cache.has(req.params.name)) {
    return success(cache.get(req.params.name));
  }

  const lookup = `_dnslink.${req.params.name}`;

  dns.resolveTxt(lookup, (error, records) => {
    if (error) {
      if (error.code === "ENOTFOUND") {
        return failure(`ENOTFOUND: ${lookup} TXT record doesn't exist`);
      }

      if (error.code === "ENODATA") {
        return failure(`ENODATA: ${lookup} dns lookup returned no data`);
      }

      return failure(`Failed to fetch ${lookup} TXT record: ${error.message}`);
    }

    if (records.length === 0) {
      return failure(`No TXT record found for ${lookup}`);
    }

    const dnslinks = records.flat().filter((record) => dnslinkRegExp.test(record));

    if (dnslinks.length === 0) {
      return failure(`TXT records for ${lookup} found but none of them contained valid dnslink - ${hint}`);
    }

    if (dnslinks.length > 1) {
      return failure(`Multiple TXT records with valid dnslink found for ${lookup}, only one allowed`);
    }

    const [dnslink] = dnslinks;
    const matchSkylink = dnslink.match(skylinkDnslinkRegExp);

    if (!matchSkylink) {
      return failure(`TXT record with dnslink for ${lookup} contains invalid skylink - ${hint}`);
    }

    const skylink = matchSkylink[1];

    cache.set(req.params.name, skylink);

    console.log(`${req.params.name} => ${skylink}`);

    return success(skylink);
  });
});

server.listen(port, host, (error) => {
  if (error) throw error;

  console.info(`Server listening at http://${host}:${port}`);
});
