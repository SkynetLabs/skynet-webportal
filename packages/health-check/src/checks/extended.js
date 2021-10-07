const got = require("got");
const hasha = require("hasha");
const { detailedDiff } = require("deep-object-diff");
const { isEqual } = require("lodash");
const { calculateElapsedTime, ensureValidJSON, getResponseContent } = require("../utils");
const { parseSkylink } = require("skynet-js");

// corpusCheck runs through all the tests hosted at the resolver skylink created
// by the testing-corpus repo https://github.com/SkynetLabs/testing-corpus
async function corpusCheck(done) {
  // Load Test Data from file
  const testData = require("../fixtures/testdata.json");

  // Loop over test data and execute tests
  testData.forEach((test) => {
    if (test.skylink) {
      // Skylink Verification
      skylinkVerification(done, test);
    }
    if (test.hns) {
      // HNS verification
      hnsVerification(done, test);
    }
  });
}

const uniswapBodyHash = "3965f9a7def085b3a764ddc76a528eda38d72359";
const uniswapMetadata = require("../fixtures/uniswapMetadata.json");

// uniswapCheck returns the result of trying to download the skylink
// for the Uniswap Application
function uniswapCheck(done) {
  const linkInfo = {
    name: "Uniswap",
    skylink: "IAC6CkhNYuWZqMVr1gob1B6tPg4MrBGRzTaDvAIAeu9A9w/",
    bodyHash: uniswapBodyHash,
    metadata: uniswapMetadata,
  };

  skylinkVerification(done, linkInfo);
}

// uniswapRedirectCheck returns the result of trying to download the skylink
// for the Uniswap Application without a trailing slash
function uniswapRedirectCheck(done) {
  const linkInfo = {
    name: "Uniswap",
    skylink: "IAC6CkhNYuWZqMVr1gob1B6tPg4MrBGRzTaDvAIAeu9A9w",
    bodyHash: uniswapBodyHash,
    metadata: uniswapMetadata,
  };

  skylinkVerification(done, linkInfo);
}

// uniswapIndexFileCheck returns the result of trying to download the skylink
// for the Uniswap Application with a trailing /index.html
function uniswapIndexFileCheck(done) {
  const linkInfo = {
    name: "Uniswap Skylink Index File",
    skylink: "IAC6CkhNYuWZqMVr1gob1B6tPg4MrBGRzTaDvAIAeu9A9w/index.html",
    bodyHash: uniswapBodyHash,
    metadata: {
      filename: "/index.html",
      length: 3268,
      subfiles: { "index.html": { filename: "index.html", contenttype: "text/html", len: 3268 } },
    },
  };

  skylinkVerification(done, linkInfo);
}

// uniswapHNSCheck returns the result of trying to download the skylink
// for the Uniswap Application with the HNS domain
function uniswapHNSCheck(done) {
  const linkInfo = {
    name: "Uniswap HNS",
    skylink: "hns/uniswap-dex/",
    bodyHash: uniswapBodyHash,
    metadata: uniswapMetadata,
  };

  skylinkVerification(done, linkInfo);
}

// uniswapHNSRedirectCheck returns the result of trying to download the skylink
// for the Uniswap Application with the HNS domain and without a trailing slash
function uniswapHNSRedirectCheck(done) {
  const linkInfo = {
    name: "Uniswap HNS Redirect",
    skylink: "hns/uniswap-dex",
    bodyHash: uniswapBodyHash,
    metadata: uniswapMetadata,
  };

  skylinkVerification(done, linkInfo);
}

function parseHeaderString(header) {
  try {
    return JSON.parse(header);
  } catch {
    return header;
  }
}

// hnsVerification verifies an hns domain against provided information.
async function hnsVerification(done, expected) {
  const time = process.hrtime();
  const details = { name: expected.name, hns: expected.hns };

  try {
    const portalDomain = `${process.env.SKYNET_PORTAL_API}`.replace("https://", "");
    const query = `https://${expected.hns}.hns.${portalDomain}`;
    const response = await got(query);
    const entry = { ...details, up: true, statusCode: response.statusCode, time: calculateElapsedTime(time) };

    done(entry); // Return the entry information
  } catch (error) {
    done({
      ...details,
      up: false,
      ip: error?.response?.ip ?? null,
      statusCode: error?.response?.statusCode || error.statusCode || error.status,
      errorMessage: error.message,
      errorResponseContent: getResponseContent(error.response),
      time: calculateElapsedTime(time),
    });
  }
}

// skylinkVerification verifies a skylink against provided information.
async function skylinkVerification(done, expected, { followRedirect = true, method = "get" } = {}) {
  const time = process.hrtime();
  const details = { name: expected.name, skylink: expected.skylink };

  try {
    const query = `${process.env.SKYNET_PORTAL_API}/${expected.skylink}`;
    const response = await got[method](query, { followRedirect, headers: { cookie: "nocache=true" } });
    const entry = { ...details, up: true, statusCode: response.statusCode, time: calculateElapsedTime(time) };
    const info = {};

    if (expected.statusCode && expected.statusCode !== response.statusCode) {
      entry.up = false;
      info.statusCode = { expected: expected.statusCode, current: response.statusCode };
    }

    // Check if the response body is valid by checking against the known hash
    if ("bodyHash" in expected) {
      const currentBodyHash = hasha(response.rawBody, { algorithm: "sha1" });
      if (currentBodyHash !== expected.bodyHash) {
        entry.up = false;
        info.bodyHash = { expected: expected.bodyHash, current: currentBodyHash };
      }
    }

    if (expected.headers) {
      Object.entries(expected.headers).forEach(([headerName, expectedHeader]) => {
        const currentHeader = parseHeaderString(response.headers[headerName]);
        if (!isEqual(currentHeader, expectedHeader)) {
          entry.up = false;
          info.headers = info.headers ?? {};
          if (typeof currentHeader === "object") {
            info.headers[headerName] = ensureValidJSON(detailedDiff(expectedHeader, currentHeader));
          } else {
            info.headers[headerName] = { expected: expectedHeader, current: currentHeader };
          }
        }
      });
    }

    if (expected.metadata && expected.skylink) {
      const skylink = parseSkylink(expected.skylink);
      const url = `${process.env.SKYNET_PORTAL_API}/skynet/metadata/${skylink}`;
      try {
        const metadata = await got(url).json();
        if (!isEqual(expected.metadata, metadata)) {
          entry.up = false;
          info.metadata = { url, diff: ensureValidJSON(detailedDiff(expected.metadata, metadata)) };
        }
      } catch (error) {
        entry.up = false;
        info.metadata = {
          url,
          ip: error?.response?.ip ?? null,
          statusCode: error?.response?.statusCode || error.statusCode || error.status,
          errorMessage: error.message,
          errorResponseContent: getResponseContent(error.response),
        };
      }
    }

    if (Object.keys(info).length) entry.info = info; // add info only if it exists

    done(entry); // Return the entry information
  } catch (error) {
    done({
      ...details,
      up: false,
      ip: error?.response?.ip ?? null,
      statusCode: error?.response?.statusCode || error.statusCode || error.status,
      errorMessage: error.message,
      errorResponseContent: getResponseContent(error.response),
      time: calculateElapsedTime(time),
    });
  }
}

module.exports = [
  corpusCheck,
  // uniswapIndexFileCheck,
  // uniswapCheck,
  // uniswapRedirectCheck,
  // uniswapHNSCheck,
  // uniswapHNSRedirectCheck,
];
