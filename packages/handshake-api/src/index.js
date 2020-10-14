const express = require("express");
const punycode = require("punycode");
const NodeCache = require("node-cache");
const { NodeClient } = require("hs-client");

const host = process.env.HOSTNAME || "0.0.0.0";
const port = Number(process.env.PORT) || 3100;

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
const cache = new NodeCache({ stdTTL: 300 }); // cache for 5 minutes

// Match both `sia://HASH` and `HASH` links.
const startsWithSkylinkRegExp = /^(sia:\/\/)?[a-zA-Z0-9_-]{46}/;

const getDomainRecords = async (name) => {
  if (cache.has(name)) return cache.get(name);

  const response = await client.execute("getnameresource", [name]);
  const records = response?.records ?? null;

  console.log(`${name} => ${JSON.stringify(records)}`);

  cache.set(name, records);

  return records;
};

const findSkylinkRecord = (records) => {
  // Find the last one, so people can update their domains in a non-destructive
  // way by simply adding a new link. This will also allow keeping links to
  // older versions for backwards compatibility.
  return records
    ?.slice()
    .reverse()
    .find(({ txt }) => txt?.some((entry) => isValidSkylink(entry)));
};

const getSkylinkFromRecord = (record) => {
  return record?.txt?.find((entry) => isValidSkylink(entry));
};

const resolveDomainHandler = async (req, res) => {
  try {
    const domain = punycode.toASCII(req.params.name);
    const records = await getDomainRecords(domain);
    if (!records) return res.status(404).send(`No records found for ${domain}`);

    const record = findSkylinkRecord(records);
    if (!record) throw new Error(`No skylink found in dns records of ${domain}`);

    const skylink = getSkylinkFromRecord(record);
    return res.json({ skylink });
  } catch (error) {
    res.status(500).send(`Handshake error: ${error.message}`);
  }
};

// Checks if the given string is a valid Sia link.
function isValidSkylink(link) {
  if (!link || link.length === 0) {
    return false;
  }
  return Boolean(link.match(startsWithSkylinkRegExp));
}

const server = express();

server.get("/hnsres/:name", resolveDomainHandler);

server.listen(port, host, (error) => {
  if (error) throw error;

  console.info(`API will look for HSD Server at ${hsdHost}:${hsdPort}, "${hsdNetworkType}" network.`);
  console.info(`Server listening at http://${host}:${port}`);
});
