const express = require("express");
const proxy = require("express-http-proxy");
const { NodeClient } = require("hs-client");

const host = process.env.HOST || "localhost";
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

const resolveDomain = async (name) => {
  const response = await client.execute("getnameresource", [name]);

  if (!response) throw new Error("API not responding");

  console.log(`${name} => ${JSON.stringify(response.records)}`);

  return response;
};

const findSkylinkRecord = (records) => {
  return records?.find(({ txt }) => txt?.some((entry) => isValidSkylink(entry)));
};

const getSkylinkFromRecord = (record) => {
  return record?.txt?.find((entry) => isValidSkylink(entry));
};

const resolveDomainHandler = async (req, res) => {
  try {
    const response = await resolveDomain(req.params.name);
    const record = findSkylinkRecord(response.records);
    if (!record) return res.status(404).send(`No skylink found for ${req.params.name}`);
    const skylink = getSkylinkFromRecord(record);
    return res.json({ skylink });
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

server.use(
  "/hns/:name",
  proxy("caddy:443", {
    https: true,
    proxyReqPathResolver: async (req) => {
      const response = await resolveDomain(req.params.name);
      const record = findSkylinkRecord(response.records);
      if (!record) throw new Error(`No skylink found for ${req.params.name}`);
      const skylink = getSkylinkFromRecord(record);

      // if this is exact domain call, do not append anything to skylink entry
      if (req.url === "" || req.url === "/") return `/${skylink}`;

      // drop any index.html or trailing slash from the skylink entry
      const path = skylink.split("/").slice(0, -1).join("/");

      return `/${path}${req.url}`;
    },
  })
);

server.get("/hnsres/:name", resolveDomainHandler);

server.listen(port, host, (error) => {
  if (error) throw error;

  console.info(`API will look for HSD Server at ${hsdHost}:${hsdPort}, "${hsdNetworkType}" network.`);
  console.info(`Server listening at http://${host}:${port}`);
});
