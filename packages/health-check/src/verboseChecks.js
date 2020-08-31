const superagent = require("superagent");
const hash = require("object-hash");
const { detailedDiff } = require("deep-object-diff");
const { isEqual } = require("lodash");
const checks = require("./basicChecks");
const developMomentumMetadata = require("./metadata");
const skyGalleryMetadata = require("./metadata");
const uniswapMetadata = require("./metadata");

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

// covid19PaperCheck returns the result of trying to download the skylink
// for a known Covid19 paper
function covid19PaperCheck(done) {
  const linkInfo = {
    description: "Covid-19 Paper",
    skylink: "PAMZVmfutxWoG6Wnl5BRKuWLkDNZR42k_okRRvksJekA3A",
    bodyHash: "81b9fb74829a96ceafa429840d1ef0ce44376ddd",
    metadata: {
      filename: "An Effective Treatment for Coronavirus (COVID-19).pdf",
      subfiles: {
        "An Effective Treatment for Coronavirus (COVID-19).pdf": {
          filename: "An Effective Treatment for Coronavirus (COVID-19).pdf",
          contenttype: "application/pdf",
          len: 474803,
        },
      },
    },
  };

  skylinkVerification(done, linkInfo);
}

// covid19CoroNopePaperCheck returns the result of trying to download the skylink
// for another known Covid19 paper
function covid19CoroNopePaperCheck(done) {
  const linkInfo = {
    description: "Covid-19 CoroNope Paper",
    skylink: "bACLKGmcmX4NCp47WwOOJf0lU666VLeT5HRWpWVtqZPjEA",
    bodyHash: "901f6fd65ef595f70b6bfebbb2d05942351ef2b3",
    metadata: { filename: "coronope.pdf" },
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

const developMomentumBodyHash = "53b44a9d3cfa9b3d66ce5c29976f4383725d3652";

// developMomentumCheck returns the result of trying to download the skylink
// for the Develop Momentum Application
function developMomentumCheck(done) {
  const linkInfo = {
    description: "Develop Momentum Index File",
    skylink: "EAA1fG_ip4C1Vi1Ijvsr1oyr8jpH0Bo9HXya0T3kw-elGw/",
    bodyHash: developMomentumBodyHash,
    metadata: developMomentumMetadata,
  };

  skylinkVerification(done, linkInfo);
}

// developMomentumRedirectCheck returns the result of trying to download the skylink
// for the Develop Momentum Application without the tailing slash
function developMomentumRedirectCheck(done) {
  const linkInfo = {
    description: "Develop Momentum Index File",
    skylink: "EAA1fG_ip4C1Vi1Ijvsr1oyr8jpH0Bo9HXya0T3kw-elGw",
    bodyHash: developMomentumBodyHash,
    metadata: developMomentumMetadata,
  };

  skylinkVerification(done, linkInfo);
}

// developMomentumIndexFileCheck returns the result of trying to download the skylink
// for the Develop Momentum Application with a trailing /index.html
function developMomentumIndexFileCheck(done) {
  const linkInfo = {
    description: "Develop Momentum Index File",
    skylink: "EAA1fG_ip4C1Vi1Ijvsr1oyr8jpH0Bo9HXya0T3kw-elGw/index.html",
    bodyHash: developMomentumBodyHash,
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

const skyGalleryBodyHash = "077e54054748d278114f1870f8045a162eb73641";

// skyGalleryCheck returns the result of trying to download the skylink for the SkyGallery Application.
function skyGalleryCheck(done) {
  const linkInfo = {
    description: "SkyGallery",
    skylink: "AADW6GsQcetwDBaDYnGCSTbYjSKY743NtY1A5VRx5sj3Dg/",
    bodyHash: skyGalleryBodyHash,
    metadata: skyGalleryMetadata,
  };

  skylinkVerification(done, linkInfo);
}

// skyGalleryIndexFileCheck returns the result of trying to download the skylink
// for the SkyGallery Application with a trailing /index.html
function skyGalleryIndexFileCheck(done) {
  const linkInfo = {
    description: "SkyGallery Index File",
    skylink: "AADW6GsQcetwDBaDYnGCSTbYjSKY743NtY1A5VRx5sj3Dg/index.html",
    bodyHash: skyGalleryBodyHash,
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
    bodyHash: skyGalleryBodyHash,
    metadata: skyGalleryMetadata,
  };

  skylinkVerification(done, linkInfo);
}

// uncensoredLibraryCheck returns the result of trying to download the skylink
// for the uncensored library skylink
function uncensoredLibraryCheck(done) {
  const linkInfo = {
    description: "Uncensored Library",
    skylink: "AAC5glnZyNJ4Ieb4MhnYJGtID6qdMqEjl0or5EvEMt7bWQ",
    bodyHash: "60da6cb958699c5acd7f2a2911656ff32fca89a7",
    metadata: {
      filename: "Unzip_The_Uncensored_Library_Map.zip",
      subfiles: {
        "Unzip_The_Uncensored_Library_Map.zip": {
          filename: "Unzip_The_Uncensored_Library_Map.zip",
          contenttype: "application/zip",
          len: 76744822,
        },
      },
    },
  };

  skylinkVerification(done, linkInfo);
}

const uniswapBodyHash = "3965f9a7def085b3a764ddc76a528eda38d72359";

// uniswapCheck returns the result of trying to download the skylink
// for the Uniswap Application
function uniswapCheck(done) {
  const linkInfo = {
    description: "Uniswap",
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
    description: "Uniswap",
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
    description: "Uniswap Skylink Index File",
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
    description: "Uniswap HNS",
    skylink: "hns/doesn/",
    bodyHash: uniswapBodyHash,
    metadata: uniswapMetadata,
  };

  skylinkVerification(done, linkInfo);
}

// uniswapHNSRedirectCheck returns the result of trying to download the skylink
// for the Uniswap Application with the HNS domain and without a trailing slash
function uniswapHNSRedirectCheck(done) {
  const linkInfo = {
    description: "Uniswap HNS Redirect",
    skylink: "hns/doesn",
    bodyHash: uniswapBodyHash,
    metadata: uniswapMetadata,
  };

  skylinkVerification(done, linkInfo);
}

// uniswapHNSResolverCheck returns the result of trying to download the skylink
// for the Uniswap Application via the HNS resolver endpoint
function uniswapHNSResolverCheck(done) {
  const linkInfo = {
    description: "Uniswap HNS Resolver",
    skylink: "hnsres/doesn/",
    bodyHash: "44a3f0f56861ae841a6cb19cb0b3edf98ad610f8",
    metadata: null,
  };

  skylinkVerification(done, linkInfo);
}

// uniswapHNSResolverRedirectCheck returns the result of trying to download the skylink
// for the Uniswap Application via the HNS resolver endpoint without the
// trailing slash
function uniswapHNSResolverRedirectCheck(done) {
  const linkInfo = {
    description: "Uniswap HNS Resolver Redirect",
    skylink: "hnsres/doesn",
    bodyHash: "44a3f0f56861ae841a6cb19cb0b3edf98ad610f8",
    metadata: null,
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
        // Check if the metadata is valid
        const metadata = res.header["skynet-file-metadata"] ? JSON.parse(res.header["skynet-file-metadata"]) : null;
        const validMetadata = isEqual(metadata, linkInfo.metadata);
        // Redetermine if the Skylink is up based on the results from the body
        // and metadata hash checks
        up = up && validBody && validMetadata;

        info = {
          body: { valid: validBody },
          metadata: { valid: validMetadata, diff: detailedDiff(metadata, linkInfo.metadata) },
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
  covid19PaperCheck,
  covid19CoroNopePaperCheck,
  dappExampleCheck,
  developMomentumIndexFileCheck,
  developMomentumCheck,
  developMomentumRedirectCheck,
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
  uncensoredLibraryCheck,
  uniswapIndexFileCheck,
  uniswapCheck,
  uniswapRedirectCheck,
  uniswapHNSCheck,
  uniswapHNSRedirectCheck,
  uniswapHNSResolverCheck,
  uniswapHNSResolverRedirectCheck,
];
