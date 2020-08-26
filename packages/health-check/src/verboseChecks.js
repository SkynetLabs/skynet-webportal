const superagent = require("superagent");
const hash = require("object-hash");
const { detailedDiff } = require("deep-object-diff");
const { isEqual } = require("lodash");
const checks = require("./basicChecks");

// audioExampleCheck returns the result of trying to download the skylink
// for the Example audio file on siasky.net
function audioExampleCheck(done) {
  const linkInfo = {
    description: "Audio Example",
    skylink: "_A2zt5SKoqwnnZU4cBF8uBycSKULXMyeg1c5ZISBr2Q3dA",
    bodyHash: "be335f5ad9bc357248f3d35c7e49df491afb6b12",
    metadata: { filename: "feel-good.mp3" },
  };

  skylinkVerification(done, linkInfo);
}

// dappExampleCheck returns the result of trying to download the skylink
// for the Example Dapp on siasky.net
function dappExampleCheck(done) {
  const linkInfo = {
    description: "Dapp Example (UniSwap)",
    skylink: "EAC5HJr5Pu086EAZG4fP_r6Pnd7Ft366vt6t2AnjkoFb9Q/index.html",
    bodyHash: "d6ad2506590bb45b5acc6a8a964a3da4d657354f",
    metadata: {
      filename: "/index.html",
      length: 4131,
      subfiles: { "index.html": { filename: "index.html", contenttype: "text/html", len: 4131 } },
    },
  };

  skylinkVerification(done, linkInfo);
}

// developMomentumIndexFileCheck returns the result of trying to download the skylink
// for the Develop Momentum Application with a trailing /index.html
function developMomentumIndexFileCheck(done) {
  const linkInfo = {
    description: "Develop Momentum Index File",
    skylink: "EAA1fG_ip4C1Vi1Ijvsr1oyr8jpH0Bo9HXya0T3kw-elGw/index.html",
    bodyHash: "53b44a9d3cfa9b3d66ce5c29976f4383725d3652",
    metadata: {
      filename: "/index.html",
      length: 4981,
      subfiles: { "index.html": { filename: "index.html", contenttype: "text/html", len: 4981 } },
    },
  };

  skylinkVerification(done, linkInfo);
}

// htmlExampleCheck returns the result of trying to download the skylink
// for the Example HTML file on siasky.net
function htmlExampleCheck(done) {
  const linkInfo = {
    description: "HTML Example",
    skylink: "PAL0w4SdA5rFCDGEutgpeQ50Om-YkBabtXVOJAkmedslKw",
    bodyHash: "c932fd56f98b6db589e56be8018817f13bb29f72",
    metadata: { filename: "introduction â Sia API Documentation.html" },
  };

  skylinkVerification(done, linkInfo);
}

// imageExampleCheck returns the result of trying to download the skylink
// for the Example image on siasky.net
function imageExampleCheck(done) {
  const linkInfo = {
    description: "Image Example",
    skylink: "IADUs8d9CQjUO34LmdaaNPK_STuZo24rpKVfYW3wPPM2uQ",
    bodyHash: "313207978d0a88bf2b961f098804e9ab0f82837f",
    metadata: { filename: "sia-lm.png" },
  };

  skylinkVerification(done, linkInfo);
}

// jsonExampleCheck returns the result of trying to download the skylink
// for the Example JSON file on siasky.net
function jsonExampleCheck(done) {
  const linkInfo = {
    description: "JSON Example",
    skylink: "AAC0uO43g64ULpyrW0zO3bjEknSFbAhm8c-RFP21EQlmSQ",
    bodyHash: "198771c3d07d5c7302aadcc0697a7298e5e8ccc3",
    metadata: { filename: "consensus.json" },
  };

  skylinkVerification(done, linkInfo);
}

// pdfExampleCheck returns the result of trying to download the skylink
// for the Example PDF file on siasky.net
function pdfExampleCheck(done) {
  const linkInfo = {
    description: "PDF Example",
    skylink: "XABvi7JtJbQSMAcDwnUnmp2FKDPjg8_tTTFP4BwMSxVdEg",
    bodyHash: "9bd8162e1575569a9041972f7f62d65887063dc3",
    metadata: { filename: "sia.pdf" },
  };

  skylinkVerification(done, linkInfo);
}

// randomImageCheck returns the result of trying to download the skylink for
// a Random Image.
function randomImageCheck(done) {
  const linkInfo = {
    description: "Random Image",
    skylink: "PAHx7JmsU9EFGbqm5q0LNKT2wKfoJ_mhPI8zWlNEXZ8uOQ/",
    bodyHash: "4c73c5a0eddd5823be677d7f93bf80cc9338ee9f",
    metadata: {
      filename: "30355444.png",
      subfiles: { "30355444.png": { filename: "30355444.png", contenttype: "image/png", len: 350473 } },
      defaultpath: "/30355444.png",
    },
  };

  skylinkVerification(done, linkInfo);
}

// randomImageRedirectCheck returns the result of trying to download the skylink for
// a Random Image with no trailing slash.
function randomImageRedirectCheck(done) {
  const linkInfo = {
    description: "Random Image Redirect",
    skylink: "PAHx7JmsU9EFGbqm5q0LNKT2wKfoJ_mhPI8zWlNEXZ8uOQ",
    bodyHash: "4c73c5a0eddd5823be677d7f93bf80cc9338ee9f",
    metadata: {
      filename: "30355444.png",
      subfiles: { "30355444.png": { filename: "30355444.png", contenttype: "image/png", len: 350473 } },
      defaultpath: "/30355444.png",
    },
  };

  skylinkVerification(done, linkInfo);
}

// skyBayCheck returns the result of trying to download the skylink for the SkyBay Application.
function skyBayCheck(done) {
  const linkInfo = {
    description: "SkyBay",
    skylink: "EABkMjXzxJRpPz0eO0Or5fy2eo-rz3prdigGwRlyNd9mwA/",
    bodyHash: "25d63937c9734fb08d2749c6517d1b3de8ecb856",
    metadata: {
      filename: "skybay.html",
      subfiles: { "skybay.html": { filename: "skybay.html", contenttype: "text/html", len: 11655 } },
    },
  };

  skylinkVerification(done, linkInfo);
}

// skyBayRedirectCheck returns the result of trying to download the skylink
// for the SkyBay Application with no trailing slash.
function skyBayRedirectCheck(done) {
  const linkInfo = {
    description: "SkyBay Redirect",
    skylink: "EABkMjXzxJRpPz0eO0Or5fy2eo-rz3prdigGwRlyNd9mwA",
    bodyHash: "25d63937c9734fb08d2749c6517d1b3de8ecb856",
    metadata: {
      filename: "skybay.html",
      subfiles: { "skybay.html": { filename: "skybay.html", contenttype: "text/html", len: 11655 } },
    },
  };

  skylinkVerification(done, linkInfo);
}

// skyBinCheck returns the result of trying to download the skylink for the SkyBin Application.
function skyBinCheck(done) {
  const linkInfo = {
    description: "SkyBin",
    skylink: "CAAVU14pB9GRIqCrejD7rlS27HltGGiiCLICzmrBV0wVtA/",
    bodyHash: "767ec67c417e11b97c5db7dad9ea3b6b27cb0d39",
    metadata: { filename: "skybin.html" },
  };

  skylinkVerification(done, linkInfo);
}

// skyBinRedirectCheck returns the result of trying to download the skylink
// for the SkyBin Application with no trailing slash.
function skyBinRedirectCheck(done) {
  const linkInfo = {
    description: "SkyBin Redirect",
    skylink: "CAAVU14pB9GRIqCrejD7rlS27HltGGiiCLICzmrBV0wVtA",
    bodyHash: "767ec67c417e11b97c5db7dad9ea3b6b27cb0d39",
    metadata: { filename: "skybin.html" },
  };

  skylinkVerification(done, linkInfo);
}

// skyGalleryCheck returns the result of trying to download the skylink for the SkyGallery Application.
function skyGalleryCheck(done) {
  const linkInfo = {
    description: "SkyGallery",
    skylink: "AADW6GsQcetwDBaDYnGCSTbYjSKY743NtY1A5VRx5sj3Dg/",
    bodyHash: "077e54054748d278114f1870f8045a162eb73641",
    metadata: {
      filename: "skygallery-v0.1.1-76c4c115fcb526716b2564568850f433",
      subfiles: {
        "css/app.84a130ed.css": { filename: "css/app.84a130ed.css", contenttype: "text/css", len: 698 },
        "css/chunk-5ce44031.d4e78528.css": {
          filename: "css/chunk-5ce44031.d4e78528.css",
          contenttype: "text/css",
          offset: 698,
          len: 45,
        },
        "css/chunk-6bef839b.593aa2be.css": {
          filename: "css/chunk-6bef839b.593aa2be.css",
          contenttype: "text/css",
          offset: 743,
          len: 5013,
        },
        "css/chunk-8ed50a48.8ba8c09d.css": {
          filename: "css/chunk-8ed50a48.8ba8c09d.css",
          contenttype: "text/css",
          offset: 5756,
          len: 7204,
        },
        "css/chunk-eb4c1efc.2a7e25ed.css": {
          filename: "css/chunk-eb4c1efc.2a7e25ed.css",
          contenttype: "text/css",
          offset: 12960,
          len: 45,
        },
        "css/chunk-vendors.b4f58487.css": {
          filename: "css/chunk-vendors.b4f58487.css",
          contenttype: "text/css",
          offset: 13005,
          len: 382063,
        },
        "img/skygallery_logo.2336197e.svg": {
          filename: "img/skygallery_logo.2336197e.svg",
          contenttype: "image/svg+xml",
          offset: 395068,
          len: 923,
        },
        "img/skynet-logo-animated.4d24345c.svg": {
          filename: "img/skynet-logo-animated.4d24345c.svg",
          contenttype: "image/svg+xml",
          offset: 395991,
          len: 2600,
        },
        "index.html": { filename: "index.html", contenttype: "text/html", offset: 398591, len: 2534 },
        "js/app.cff1e0a4.js": {
          filename: "js/app.cff1e0a4.js",
          contenttype: "application/javascript",
          offset: 401125,
          len: 15604,
        },
        "js/app.cff1e0a4.js.map": {
          filename: "js/app.cff1e0a4.js.map",
          contenttype: "application/json",
          offset: 416729,
          len: 54424,
        },
        "js/chunk-5ce44031.7fb55da9.js": {
          filename: "js/chunk-5ce44031.7fb55da9.js",
          contenttype: "application/javascript",
          offset: 471153,
          len: 3644,
        },
        "js/chunk-5ce44031.7fb55da9.js.map": {
          filename: "js/chunk-5ce44031.7fb55da9.js.map",
          contenttype: "application/json",
          offset: 474797,
          len: 13494,
        },
        "js/chunk-6bef839b.b543fe7d.js": {
          filename: "js/chunk-6bef839b.b543fe7d.js",
          contenttype: "application/javascript",
          offset: 488291,
          len: 13349,
        },
        "js/chunk-6bef839b.b543fe7d.js.map": {
          filename: "js/chunk-6bef839b.b543fe7d.js.map",
          contenttype: "application/json",
          offset: 501640,
          len: 46690,
        },
        "js/chunk-8ed50a48.35f8ef35.js": {
          filename: "js/chunk-8ed50a48.35f8ef35.js",
          contenttype: "application/javascript",
          offset: 548330,
          len: 130329,
        },
        "js/chunk-8ed50a48.35f8ef35.js.map": {
          filename: "js/chunk-8ed50a48.35f8ef35.js.map",
          contenttype: "application/json",
          offset: 678659,
          len: 507145,
        },
        "js/chunk-eb4c1efc.57b6e01c.js": {
          filename: "js/chunk-eb4c1efc.57b6e01c.js",
          contenttype: "application/javascript",
          offset: 1185804,
          len: 4407,
        },
        "js/chunk-eb4c1efc.57b6e01c.js.map": {
          filename: "js/chunk-eb4c1efc.57b6e01c.js.map",
          contenttype: "application/json",
          offset: 1190211,
          len: 15355,
        },
        "js/chunk-vendors.1fd55121.js": {
          filename: "js/chunk-vendors.1fd55121.js",
          contenttype: "application/javascript",
          offset: 1205566,
          len: 749829,
        },
        "js/chunk-vendors.1fd55121.js.map": {
          filename: "js/chunk-vendors.1fd55121.js.map",
          contenttype: "application/json",
          offset: 1955395,
          len: 2793251,
        },
      },
      defaultpath: "/index.html",
    },
  };

  skylinkVerification(done, linkInfo);
}

// skyGalleryIndexFileCheck returns the result of trying to download the skylink
// for the SkyGallery Application with a trailing /index.html
function skyGalleryIndexFileCheck(done) {
  const linkInfo = {
    description: "SkyGallery Index File",
    skylink: "AADW6GsQcetwDBaDYnGCSTbYjSKY743NtY1A5VRx5sj3Dg/index.html",
    bodyHash: "077e54054748d278114f1870f8045a162eb73641",
    metadata: {
      filename: "/index.html",
      length: 2534,
      subfiles: { "index.html": { filename: "index.html", contenttype: "text/html", len: 2534 } },
    },
  };

  skylinkVerification(done, linkInfo);
}

// skyGalleryRedirectCheck returns the result of trying to download the skylink
// for the SkyGallery Application with no trailing slash.
function skyGalleryRedirectCheck(done) {
  const linkInfo = {
    description: "SkyGallery Redirect",
    skylink: "AADW6GsQcetwDBaDYnGCSTbYjSKY743NtY1A5VRx5sj3Dg",
    bodyHash: "077e54054748d278114f1870f8045a162eb73641",
    metadata: {
      filename: "skygallery-v0.1.1-76c4c115fcb526716b2564568850f433",
      subfiles: {
        "css/app.84a130ed.css": { filename: "css/app.84a130ed.css", contenttype: "text/css", len: 698 },
        "css/chunk-5ce44031.d4e78528.css": {
          filename: "css/chunk-5ce44031.d4e78528.css",
          contenttype: "text/css",
          offset: 698,
          len: 45,
        },
        "css/chunk-6bef839b.593aa2be.css": {
          filename: "css/chunk-6bef839b.593aa2be.css",
          contenttype: "text/css",
          offset: 743,
          len: 5013,
        },
        "css/chunk-8ed50a48.8ba8c09d.css": {
          filename: "css/chunk-8ed50a48.8ba8c09d.css",
          contenttype: "text/css",
          offset: 5756,
          len: 7204,
        },
        "css/chunk-eb4c1efc.2a7e25ed.css": {
          filename: "css/chunk-eb4c1efc.2a7e25ed.css",
          contenttype: "text/css",
          offset: 12960,
          len: 45,
        },
        "css/chunk-vendors.b4f58487.css": {
          filename: "css/chunk-vendors.b4f58487.css",
          contenttype: "text/css",
          offset: 13005,
          len: 382063,
        },
        "img/skygallery_logo.2336197e.svg": {
          filename: "img/skygallery_logo.2336197e.svg",
          contenttype: "image/svg+xml",
          offset: 395068,
          len: 923,
        },
        "img/skynet-logo-animated.4d24345c.svg": {
          filename: "img/skynet-logo-animated.4d24345c.svg",
          contenttype: "image/svg+xml",
          offset: 395991,
          len: 2600,
        },
        "index.html": { filename: "index.html", contenttype: "text/html", offset: 398591, len: 2534 },
        "js/app.cff1e0a4.js": {
          filename: "js/app.cff1e0a4.js",
          contenttype: "application/javascript",
          offset: 401125,
          len: 15604,
        },
        "js/app.cff1e0a4.js.map": {
          filename: "js/app.cff1e0a4.js.map",
          contenttype: "application/json",
          offset: 416729,
          len: 54424,
        },
        "js/chunk-5ce44031.7fb55da9.js": {
          filename: "js/chunk-5ce44031.7fb55da9.js",
          contenttype: "application/javascript",
          offset: 471153,
          len: 3644,
        },
        "js/chunk-5ce44031.7fb55da9.js.map": {
          filename: "js/chunk-5ce44031.7fb55da9.js.map",
          contenttype: "application/json",
          offset: 474797,
          len: 13494,
        },
        "js/chunk-6bef839b.b543fe7d.js": {
          filename: "js/chunk-6bef839b.b543fe7d.js",
          contenttype: "application/javascript",
          offset: 488291,
          len: 13349,
        },
        "js/chunk-6bef839b.b543fe7d.js.map": {
          filename: "js/chunk-6bef839b.b543fe7d.js.map",
          contenttype: "application/json",
          offset: 501640,
          len: 46690,
        },
        "js/chunk-8ed50a48.35f8ef35.js": {
          filename: "js/chunk-8ed50a48.35f8ef35.js",
          contenttype: "application/javascript",
          offset: 548330,
          len: 130329,
        },
        "js/chunk-8ed50a48.35f8ef35.js.map": {
          filename: "js/chunk-8ed50a48.35f8ef35.js.map",
          contenttype: "application/json",
          offset: 678659,
          len: 507145,
        },
        "js/chunk-eb4c1efc.57b6e01c.js": {
          filename: "js/chunk-eb4c1efc.57b6e01c.js",
          contenttype: "application/javascript",
          offset: 1185804,
          len: 4407,
        },
        "js/chunk-eb4c1efc.57b6e01c.js.map": {
          filename: "js/chunk-eb4c1efc.57b6e01c.js.map",
          contenttype: "application/json",
          offset: 1190211,
          len: 15355,
        },
        "js/chunk-vendors.1fd55121.js": {
          filename: "js/chunk-vendors.1fd55121.js",
          contenttype: "application/javascript",
          offset: 1205566,
          len: 749829,
        },
        "js/chunk-vendors.1fd55121.js.map": {
          filename: "js/chunk-vendors.1fd55121.js.map",
          contenttype: "application/json",
          offset: 1955395,
          len: 2793251,
        },
      },
      defaultpath: "/index.html",
    },
  };

  skylinkVerification(done, linkInfo);
}

// uniswapIndexFileCheck returns the result of trying to download the skylink
// for the Uniswap Application with a trailing /index.html
function uniswapIndexFileCheck(done) {
  const linkInfo = {
    description: "Uniswap Skylink Index File",
    skylink: "IAC6CkhNYuWZqMVr1gob1B6tPg4MrBGRzTaDvAIAeu9A9w/index.html",
    bodyHash: "3965f9a7def085b3a764ddc76a528eda38d72359",
    metadata: {
      filename: "/index.html",
      length: 3268,
      subfiles: { "index.html": { filename: "index.html", contenttype: "text/html", len: 3268 } },
    },
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
        const validMetadata = isEqual(res.header["skynet-file-metadata"], linkInfo.metadata);
        // Redetermine if the Skylink is up based on the results from the body
        // and metadata hash checks
        up = up && validBody && validMetadata;

        info = {
          body: { valid: validBody },
          metadata: { valid: validMetadata, diff: detailedDiff(res.header["skynet-file-metadata"], linkInfo.metadata) },
        };
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
