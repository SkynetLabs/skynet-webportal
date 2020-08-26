const superagent = require("superagent");
const hash = require("object-hash");
const checks = require("./basicChecks");

// audioExampleCheck returns the result of trying to download the skylink
// for the Example audio file on siasky.net
function audioExampleCheck(done) {
  const linkInfo = {
    description: "Audio Example",
    skylink: "_A2zt5SKoqwnnZU4cBF8uBycSKULXMyeg1c5ZISBr2Q3dA",
    metadataHash: "35e70208d0cf5f9ba254a2772039713be46a69d6",
    bodyHash: "be335f5ad9bc357248f3d35c7e49df491afb6b12",
  };

  skylinkVerification(done, linkInfo);
}

// dappExampleCheck returns the result of trying to download the skylink
// for the Example Dapp on siasky.net
function dappExampleCheck(done) {
  const linkInfo = {
    description: "Dapp Example (UniSwap)",
    skylink: "EAC5HJr5Pu086EAZG4fP_r6Pnd7Ft366vt6t2AnjkoFb9Q/index.html",
    metadataHash: "72ea3859b8d83b234b62e8f6e1931f969ec39402",
    bodyHash: "d6ad2506590bb45b5acc6a8a964a3da4d657354f",
  };

  skylinkVerification(done, linkInfo);
}

// developMomentumIndexFileCheck returns the result of trying to download the skylink
// for the Develop Momentum Application with a trailing /index.html
function developMomentumIndexFileCheck(done) {
  const linkInfo = {
    description: "Develop Momentum Index File",
    skylink: "EAA1fG_ip4C1Vi1Ijvsr1oyr8jpH0Bo9HXya0T3kw-elGw/index.html",
    metadataHash: "f0d06f934d28b420a77529acdb779a117a0d4cf5",
    bodyHash: "53b44a9d3cfa9b3d66ce5c29976f4383725d3652",
  };

  skylinkVerification(done, linkInfo);
}

// htmlExampleCheck returns the result of trying to download the skylink
// for the Example HTML file on siasky.net
function htmlExampleCheck(done) {
  const linkInfo = {
    description: "HTML Example",
    skylink: "PAL0w4SdA5rFCDGEutgpeQ50Om-YkBabtXVOJAkmedslKw",
    metadataHash: "eebdbfe406466ed8bbd190127a5d5a07ada68403",
    bodyHash: "c932fd56f98b6db589e56be8018817f13bb29f72",
  };

  skylinkVerification(done, linkInfo);
}

// imageExampleCheck returns the result of trying to download the skylink
// for the Example image on siasky.net
function imageExampleCheck(done) {
  const linkInfo = {
    description: "Image Example",
    skylink: "IADUs8d9CQjUO34LmdaaNPK_STuZo24rpKVfYW3wPPM2uQ",
    metadataHash: "e77df549c8e5f41881e34c3844ec7e182a0db701",
    bodyHash: "313207978d0a88bf2b961f098804e9ab0f82837f",
  };

  skylinkVerification(done, linkInfo);
}

// jsonExampleCheck returns the result of trying to download the skylink
// for the Example JSON file on siasky.net
function jsonExampleCheck(done) {
  const linkInfo = {
    description: "JSON Example",
    skylink: "AAC0uO43g64ULpyrW0zO3bjEknSFbAhm8c-RFP21EQlmSQ",
    metadataHash: "0e6ee84c15ee3bc848058575337303ad9958ec64",
    bodyHash: "198771c3d07d5c7302aadcc0697a7298e5e8ccc3",
  };

  skylinkVerification(done, linkInfo);
}

// pdfExampleCheck returns the result of trying to download the skylink
// for the Example PDF file on siasky.net
function pdfExampleCheck(done) {
  const linkInfo = {
    description: "PDF Example",
    skylink: "XABvi7JtJbQSMAcDwnUnmp2FKDPjg8_tTTFP4BwMSxVdEg",
    metadataHash: "7cb17f927c37a1c9a78221ed8b17f1af4a7299e8",
    bodyHash: "9bd8162e1575569a9041972f7f62d65887063dc3",
  };

  skylinkVerification(done, linkInfo);
}

// randomImageCheck returns the result of trying to download the skylink for
// a Random Image.
function randomImageCheck(done) {
  const linkInfo = {
    description: "Random Image",
    skylink: "PAHx7JmsU9EFGbqm5q0LNKT2wKfoJ_mhPI8zWlNEXZ8uOQ/",
    metadataHash: "1ce51445b63d7c658b02392ca7268ea90119abd7",
    bodyHash: "4c73c5a0eddd5823be677d7f93bf80cc9338ee9f",
  };

  skylinkVerification(done, linkInfo);
}

// randomImageRedirectCheck returns the result of trying to download the skylink for
// a Random Image with no trailing slash.
function randomImageRedirectCheck(done) {
  const linkInfo = {
    description: "Random Image Redirect",
    skylink: "PAHx7JmsU9EFGbqm5q0LNKT2wKfoJ_mhPI8zWlNEXZ8uOQ",
    metadataHash: "1ce51445b63d7c658b02392ca7268ea90119abd7",
    bodyHash: "4c73c5a0eddd5823be677d7f93bf80cc9338ee9f",
  };

  skylinkVerification(done, linkInfo);
}

// skyBayCheck returns the result of trying to download the skylink for the SkyBay Application.
function skyBayCheck(done) {
  const linkInfo = {
    description: "SkyBay",
    skylink: "EABkMjXzxJRpPz0eO0Or5fy2eo-rz3prdigGwRlyNd9mwA/",
    metadataHash: "4b3e12932186ed6925d1c8ad2d71e0220bd957dd",
    bodyHash: "25d63937c9734fb08d2749c6517d1b3de8ecb856",
  };

  skylinkVerification(done, linkInfo);
}

// skyBayRedirectCheck returns the result of trying to download the skylink
// for the SkyBay Application with no trailing slash.
function skyBayRedirectCheck(done) {
  const linkInfo = {
    description: "SkyBay Redirect",
    skylink: "EABkMjXzxJRpPz0eO0Or5fy2eo-rz3prdigGwRlyNd9mwA",
    metadataHash: "4b3e12932186ed6925d1c8ad2d71e0220bd957dd",
    bodyHash: "25d63937c9734fb08d2749c6517d1b3de8ecb856",
  };

  skylinkVerification(done, linkInfo);
}

// skyBinCheck returns the result of trying to download the skylink for the SkyBin Application.
function skyBinCheck(done) {
  const linkInfo = {
    description: "SkyBin",
    skylink: "CAAVU14pB9GRIqCrejD7rlS27HltGGiiCLICzmrBV0wVtA/",
    metadataHash: "5c23ba16cd62d623bfb73e86a503d681d2ffcb24",
    bodyHash: "767ec67c417e11b97c5db7dad9ea3b6b27cb0d39",
  };

  skylinkVerification(done, linkInfo);
}

// skyBinRedirectCheck returns the result of trying to download the skylink
// for the SkyBin Application with no trailing slash.
function skyBinRedirectCheck(done) {
  const linkInfo = {
    description: "SkyBin Redirect",
    skylink: "CAAVU14pB9GRIqCrejD7rlS27HltGGiiCLICzmrBV0wVtA",
    metadataHash: "5c23ba16cd62d623bfb73e86a503d681d2ffcb24",
    bodyHash: "767ec67c417e11b97c5db7dad9ea3b6b27cb0d39",
  };

  skylinkVerification(done, linkInfo);
}

// skyGalleryCheck returns the result of trying to download the skylink for the SkyGallery Application.
function skyGalleryCheck(done) {
  const linkInfo = {
    description: "SkyGallery",
    skylink: "AADW6GsQcetwDBaDYnGCSTbYjSKY743NtY1A5VRx5sj3Dg/",
    metadataHash: "b17a16a3522f2877b5b9ebdcdfd98956eade8721",
    bodyHash: "077e54054748d278114f1870f8045a162eb73641",
  };

  skylinkVerification(done, linkInfo);
}

// skyGalleryIndexFileCheck returns the result of trying to download the skylink
// for the SkyGallery Application with a trailing /index.html
function skyGalleryIndexFileCheck(done) {
  const linkInfo = {
    description: "SkyGallery Index File",
    skylink: "AADW6GsQcetwDBaDYnGCSTbYjSKY743NtY1A5VRx5sj3Dg/index.html",
    metadataHash: "203dcc63e6c3db7501822d9f0d38fab26f3dbceb",
    bodyHash: "077e54054748d278114f1870f8045a162eb73641",
  };

  skylinkVerification(done, linkInfo);
}

// skyGalleryRedirectCheck returns the result of trying to download the skylink
// for the SkyGallery Application with no trailing slash.
function skyGalleryRedirectCheck(done) {
  const linkInfo = {
    description: "SkyGallery Redirect",
    skylink: "AADW6GsQcetwDBaDYnGCSTbYjSKY743NtY1A5VRx5sj3Dg",
    metadataHash: "b17a16a3522f2877b5b9ebdcdfd98956eade8721",
    bodyHash: "077e54054748d278114f1870f8045a162eb73641",
  };

  skylinkVerification(done, linkInfo);
}

// uniswapIndexFileCheck returns the result of trying to download the skylink
// for the Uniswap Application with a trailing /index.html
function uniswapIndexFileCheck(done) {
  const linkInfo = {
    description: "Uniswap Skylink Index File",
    skylink: "IAC6CkhNYuWZqMVr1gob1B6tPg4MrBGRzTaDvAIAeu9A9w/index.html",
    metadataHash: "5baef23f7cc138a41d945727eb862fc2cd94ae45",
    bodyHash: "3965f9a7def085b3a764ddc76a528eda38d72359",
  };

  skylinkVerification(done, linkInfo);
}

// skylinkVerification verifies a skylink against known information provided in
// the linkInfo.
function skylinkVerification(done, linkInfo) {
  const time = process.hrtime();

  // Create the query for the skylink
  const query = `http://${process.env.PORTAL_URL}/${linkInfo.skylink}?nocache=true`;

  // Get the Skylink
  superagent
    .get(query)
    .responseType("blob")
    .end((err, res) => {
      // Record the statusCode
      const statusCode = (res && res.statusCode) || (err && err.statusCode) || null;
      let info = null;

      // Determine if the skylink is up. Start with checking if there was an
      // error in the request.
      let up = err === null;
      if (up) {
        // Check if the response body is valid by checking against the known
        // hash
        const validBody = hash(res.body) === linkInfo.bodyHash;
        // Check if the metadata is valid by checking against the known
        // hash
        const validMetadata = hash(res.header["skynet-file-metadata"]) === linkInfo.metadataHash;
        // Redetermine if the Skylink is up based on the results from the body
        // and metadata hash checks
        up = up && validBody && validMetadata;

        info = { validBody, validMetadata };
      }

      // Return the entry information
      done({
        name: linkInfo.description,
        up,
        info,
        statusCode,
        time: checks.catchRequestTime(time),
        critical: true,
      });
    });
}

module.exports.verboseChecks = [
  audioExampleCheck,
  dappExampleCheck,
  developMomentumIndexFileCheck,
  htmlExampleCheck,
  imageExampleCheck,
  jsonExampleCheck,
  pdfExampleCheck,
  randomImageCheck,
  randomImageRedirectCheck,
  skyBayCheck,
  skyBayRedirectCheck,
  skyBinCheck,
  skyBinRedirectCheck,
  skyGalleryCheck,
  skyGalleryIndexFileCheck,
  skyGalleryRedirectCheck,
  uniswapIndexFileCheck,
];
