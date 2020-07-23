const bodyparser = require("body-parser");
const express = require("express");
const { NodeClient } = require("hs-client");

const host = process.env.HOST || "localhost";
const port = Number(process.env.PORT) || 3100;

const portal = process.env.PORTAL || "https://siasky.net";

const hsdNetworkType = process.env.HSD_NETWORK || "regtest";
const hsdHost = process.env.HSD_HOST || "localhost";
const hsdPort = Number(process.env.HSD_PORT) || 12037;
const hsdApiKey = process.env.HSD_API_KEY || "foo";

const clientOptions = {
  network: hsdNetworkType,
  host: hsdHost,
  port: hsdPort,
  apiKey: hsdApiKey,
};
const client = new NodeClient(clientOptions);

const resolveDomain = async (name) => {
  const response = await client.execute("getnameresource", [name]);

  if (!response) throw new Error("API not responding");

  console.log(`${name} => ${JSON.stringify(response.records)}`);

  return response;
};

const resolveDomainHandler = async (req, res, redirect = false) => {
  try {
    const response = await resolveDomain(req.params.name);
    const record = response.records.find(({ txt }) => txt && txt.some((entry) => isValidSkylink(entry)));

    if (!record) {
      return res.status(404).send(`No skylink found for ${req.params.name}`);
    }

    const skylink = record.txt.find((entry) => isValidSkylink(entry));

    if (redirect) {
      return res.redirect(`${portal}/${skylink}`);
    }

    return res.send({ skylink });
  } catch (error) {
    res.status(500).send(`Handshake error: ${error.message}`);
  }
};

const SIA_LINK_RE = /^([a-zA-Z0-9-_]{46}.*)$/;

// Checks if the given string is a valid Sia link.
function isValidSkylink(link) {
  if (!link || link.length === 0) {
    return false;
  }
  return Boolean(link.match(SIA_LINK_RE));
}

const server = express();

server.use(bodyparser.urlencoded({ extended: false }));
server.use(bodyparser.json());

server.get("/hns/:name", (req, res) => resolveDomainHandler(req, res, true));
server.get("/hnsres/:name", (req, res) => resolveDomainHandler(req, res, false));

server.listen(port, host, (error) => {
  if (error) throw error;

  console.info(`API will look for HSD Server at ${hsdHost}:${hsdPort}, "${hsdNetworkType}" network.`);
  console.info(`Server listening at http://${host}:${port}`);
});
