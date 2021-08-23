const got = require("got");
const hasha = require("hasha");
const { detailedDiff } = require("deep-object-diff");
const { isEqual } = require("lodash");
const { calculateElapsedTime, ensureValidJSON, getResponseContent } = require("../utils");
const { parseSkylink } = require("skynet-js");

// audioExampleCheck returns the result of trying to download the skylink
// for the Example audio file on siasky.net
function audioExampleCheck(done) {
  const linkInfo = {
    name: "Audio Example",
    skylink: "_A2zt5SKoqwnnZU4cBF8uBycSKULXMyeg1c5ZISBr2Q3dA",
    bodyHash: "1bea1f570043f20149ae4cb4d30089d90897b15b",
    metadata: { filename: "feel-good.mp3" },
    headers: {
      "skynet-skylink": "_A2zt5SKoqwnnZU4cBF8uBycSKULXMyeg1c5ZISBr2Q3dA",
      "content-disposition": 'inline; filename="feel-good.mp3"',
      "content-type": "audio/mpeg",
    },
  };

  skylinkVerification(done, linkInfo);
}

// covid19PaperCheck returns the result of trying to download the skylink
// for a known Covid19 paper
function covid19PaperCheck(done) {
  const linkInfo = {
    name: "Covid-19 Paper",
    skylink: "PAMZVmfutxWoG6Wnl5BRKuWLkDNZR42k_okRRvksJekA3A",
    bodyHash: "7ce20bfc4221503fd0bf909ad20c422eca125c7d",
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
    headers: {
      "skynet-skylink": "PAMZVmfutxWoG6Wnl5BRKuWLkDNZR42k_okRRvksJekA3A",
      "content-disposition": 'inline; filename="An Effective Treatment for Coronavirus (COVID-19).pdf"',
      "content-type": "application/pdf",
    },
  };

  skylinkVerification(done, linkInfo);
}

// covid19CoroNopePaperCheck returns the result of trying to download the skylink
// for another known Covid19 paper
function covid19CoroNopePaperCheck(done) {
  const linkInfo = {
    name: "Covid-19 CoroNope Paper",
    skylink: "bACLKGmcmX4NCp47WwOOJf0lU666VLeT5HRWpWVtqZPjEA",
    bodyHash: "0db705da1b1232f8344ed74fd38245d35a49a965",
    metadata: { filename: "coronope.pdf" },
    headers: {
      "skynet-skylink": "bACLKGmcmX4NCp47WwOOJf0lU666VLeT5HRWpWVtqZPjEA",
      "content-disposition": 'inline; filename="coronope.pdf"',
      "content-type": "application/pdf",
    },
  };

  skylinkVerification(done, linkInfo);
}

// dappExampleCheck returns the result of trying to download the skylink
// for the Example Dapp on siasky.net
function dappExampleCheck(done) {
  const linkInfo = {
    name: "Dapp Example (UniSwap)",
    skylink: "EADWpKD0myqH2tZa6xtKebg6kNnwYnI94fl4R8UKgNrmOA",
    bodyHash: "7b74cbb5927e964db493b82cc1f8a532f1ff72f5",
    metadata: {
      filename: "build",
      length: 15578459,
      subfiles: {
        "451.html": {
          filename: "451.html",
          contenttype: "text/html",
          offset: 40966,
          len: 200,
        },
        "asset-manifest.json": {
          filename: "asset-manifest.json",
          contenttype: "application/json",
          offset: 35832,
          len: 5134,
        },
        "favicon.ico": {
          filename: "favicon.ico",
          contenttype: "image/vnd.microsoft.icon",
          len: 31701,
        },
        "index.html": {
          filename: "index.html",
          contenttype: "text/html",
          offset: 31701,
          len: 4131,
        },
        "locales/de.json": {
          filename: "locales/de.json",
          contenttype: "application/json",
          offset: 15542609,
          len: 4376,
        },
        "locales/en.json": {
          filename: "locales/en.json",
          contenttype: "application/json",
          offset: 15558827,
          len: 4049,
        },
        "locales/es-AR.json": {
          filename: "locales/es-AR.json",
          contenttype: "application/json",
          offset: 15551984,
          len: 3624,
        },
        "locales/es-US.json": {
          filename: "locales/es-US.json",
          contenttype: "application/json",
          offset: 15574829,
          len: 3630,
        },
        "locales/it-IT.json": {
          filename: "locales/it-IT.json",
          contenttype: "application/json",
          offset: 15538386,
          len: 4223,
        },
        "locales/ro.json": {
          filename: "locales/ro.json",
          contenttype: "application/json",
          offset: 15562876,
          len: 3794,
        },
        "locales/ru.json": {
          filename: "locales/ru.json",
          contenttype: "application/json",
          offset: 15546985,
          len: 4999,
        },
        "locales/vi.json": {
          filename: "locales/vi.json",
          contenttype: "application/json",
          offset: 15569928,
          len: 4901,
        },
        "locales/zh-CN.json": {
          filename: "locales/zh-CN.json",
          contenttype: "application/json",
          offset: 15555608,
          len: 3219,
        },
        "locales/zh-TW.json": {
          filename: "locales/zh-TW.json",
          contenttype: "application/json",
          offset: 15566670,
          len: 3258,
        },
        "manifest.json": {
          filename: "manifest.json",
          contenttype: "application/json",
          offset: 41166,
          len: 297,
        },
        "precache-manifest.cd4677068c6058f8626d6818e2c12fd3.js": {
          filename: "precache-manifest.cd4677068c6058f8626d6818e2c12fd3.js",
          contenttype: "text/javascript",
          offset: 41463,
          len: 4721,
        },
        "service-worker.js": {
          filename: "service-worker.js",
          contenttype: "text/javascript",
          offset: 46184,
          len: 1185,
        },
        "static/css/0.07de6c03.chunk.css": {
          filename: "static/css/0.07de6c03.chunk.css",
          contenttype: "text/css",
          offset: 15537249,
          len: 285,
        },
        "static/css/0.07de6c03.chunk.css.map": {
          filename: "static/css/0.07de6c03.chunk.css.map",
          contenttype: "application/octet-stream",
          offset: 15537818,
          len: 568,
        },
        "static/css/5.d75e0ccb.chunk.css": {
          filename: "static/css/5.d75e0ccb.chunk.css",
          contenttype: "text/css",
          offset: 15537534,
          len: 284,
        },
        "static/css/5.d75e0ccb.chunk.css.map": {
          filename: "static/css/5.d75e0ccb.chunk.css.map",
          contenttype: "application/octet-stream",
          offset: 15536511,
          len: 738,
        },
        "static/js/0.58b0f69f.chunk.js": {
          filename: "static/js/0.58b0f69f.chunk.js",
          contenttype: "text/javascript",
          offset: 7300150,
          len: 30029,
        },
        "static/js/0.58b0f69f.chunk.js.map": {
          filename: "static/js/0.58b0f69f.chunk.js.map",
          contenttype: "application/octet-stream",
          offset: 12111459,
          len: 81144,
        },
        "static/js/1.19c370e0.chunk.js": {
          filename: "static/js/1.19c370e0.chunk.js",
          contenttype: "text/javascript",
          offset: 15495781,
          len: 40203,
        },
        "static/js/1.19c370e0.chunk.js.map": {
          filename: "static/js/1.19c370e0.chunk.js.map",
          contenttype: "application/octet-stream",
          offset: 7330179,
          len: 104594,
        },
        "static/js/10.8ea29dcd.chunk.js": {
          filename: "static/js/10.8ea29dcd.chunk.js",
          contenttype: "text/javascript",
          offset: 15483299,
          len: 12345,
        },
        "static/js/10.8ea29dcd.chunk.js.map": {
          filename: "static/js/10.8ea29dcd.chunk.js.map",
          contenttype: "application/octet-stream",
          offset: 14524416,
          len: 30393,
        },
        "static/js/11.764b8915.chunk.js": {
          filename: "static/js/11.764b8915.chunk.js",
          contenttype: "text/javascript",
          offset: 12208196,
          len: 7103,
        },
        "static/js/11.764b8915.chunk.js.map": {
          filename: "static/js/11.764b8915.chunk.js.map",
          contenttype: "application/octet-stream",
          offset: 12192603,
          len: 15593,
        },
        "static/js/12.88d4fbe5.chunk.js": {
          filename: "static/js/12.88d4fbe5.chunk.js",
          contenttype: "text/javascript",
          offset: 12055261,
          len: 16721,
        },
        "static/js/12.88d4fbe5.chunk.js.map": {
          filename: "static/js/12.88d4fbe5.chunk.js.map",
          contenttype: "application/octet-stream",
          offset: 14460215,
          len: 46695,
        },
        "static/js/13.ea207f69.chunk.js": {
          filename: "static/js/13.ea207f69.chunk.js",
          contenttype: "text/javascript",
          offset: 7168280,
          len: 347,
        },
        "static/js/13.ea207f69.chunk.js.map": {
          filename: "static/js/13.ea207f69.chunk.js.map",
          contenttype: "application/octet-stream",
          offset: 6928538,
          len: 563,
        },
        "static/js/14.d8bc0d4c.chunk.js": {
          filename: "static/js/14.d8bc0d4c.chunk.js",
          contenttype: "text/javascript",
          offset: 12870711,
          len: 336,
        },
        "static/js/14.d8bc0d4c.chunk.js.map": {
          filename: "static/js/14.d8bc0d4c.chunk.js.map",
          contenttype: "application/octet-stream",
          offset: 15535984,
          len: 527,
        },
        "static/js/15.e6215497.chunk.js": {
          filename: "static/js/15.e6215497.chunk.js",
          contenttype: "text/javascript",
          offset: 15495644,
          len: 137,
        },
        "static/js/15.e6215497.chunk.js.map": {
          filename: "static/js/15.e6215497.chunk.js.map",
          contenttype: "application/octet-stream",
          offset: 6928431,
          len: 107,
        },
        "static/js/2.f6da9598.chunk.js": {
          filename: "static/js/2.f6da9598.chunk.js",
          contenttype: "text/javascript",
          offset: 14506910,
          len: 17506,
        },
        "static/js/2.f6da9598.chunk.js.map": {
          filename: "static/js/2.f6da9598.chunk.js.map",
          contenttype: "application/octet-stream",
          offset: 12071982,
          len: 39477,
        },
        "static/js/5.5cc0868a.chunk.js": {
          filename: "static/js/5.5cc0868a.chunk.js",
          contenttype: "text/javascript",
          offset: 10199338,
          len: 1842002,
        },
        "static/js/5.5cc0868a.chunk.js.LICENSE": {
          filename: "static/js/5.5cc0868a.chunk.js.LICENSE",
          contenttype: "application/octet-stream",
          offset: 14554809,
          len: 3119,
        },
        "static/js/5.5cc0868a.chunk.js.map": {
          filename: "static/js/5.5cc0868a.chunk.js.map",
          contenttype: "application/octet-stream",
          offset: 289328,
          len: 6632626,
        },
        "static/js/6.b7681521.chunk.js": {
          filename: "static/js/6.b7681521.chunk.js",
          contenttype: "text/javascript",
          offset: 14237363,
          len: 222852,
        },
        "static/js/6.b7681521.chunk.js.map": {
          filename: "static/js/6.b7681521.chunk.js.map",
          contenttype: "application/octet-stream",
          offset: 12215299,
          len: 655412,
        },
        "static/js/7.0614dbc4.chunk.js": {
          filename: "static/js/7.0614dbc4.chunk.js",
          contenttype: "text/javascript",
          offset: 6921954,
          len: 6477,
        },
        "static/js/7.0614dbc4.chunk.js.map": {
          filename: "static/js/7.0614dbc4.chunk.js.map",
          contenttype: "application/octet-stream",
          offset: 12041340,
          len: 13921,
        },
        "static/js/8.7975098c.chunk.js": {
          filename: "static/js/8.7975098c.chunk.js",
          contenttype: "text/javascript",
          offset: 13796515,
          len: 420712,
        },
        "static/js/8.7975098c.chunk.js.LICENSE": {
          filename: "static/js/8.7975098c.chunk.js.LICENSE",
          contenttype: "application/octet-stream",
          offset: 13796191,
          len: 324,
        },
        "static/js/8.7975098c.chunk.js.map": {
          filename: "static/js/8.7975098c.chunk.js.map",
          contenttype: "application/octet-stream",
          offset: 12871047,
          len: 925144,
        },
        "static/js/9.cc860b76.chunk.js": {
          filename: "static/js/9.cc860b76.chunk.js",
          contenttype: "text/javascript",
          offset: 14557928,
          len: 920812,
        },
        "static/js/9.cc860b76.chunk.js.LICENSE": {
          filename: "static/js/9.cc860b76.chunk.js.LICENSE",
          contenttype: "application/octet-stream",
          offset: 15478740,
          len: 4559,
        },
        "static/js/9.cc860b76.chunk.js.map": {
          filename: "static/js/9.cc860b76.chunk.js.map",
          contenttype: "application/octet-stream",
          offset: 7434773,
          len: 2764565,
        },
        "static/js/main.a7822f79.chunk.js": {
          filename: "static/js/main.a7822f79.chunk.js",
          contenttype: "text/javascript",
          offset: 7168627,
          len: 131523,
        },
        "static/js/main.a7822f79.chunk.js.map": {
          filename: "static/js/main.a7822f79.chunk.js.map",
          contenttype: "application/octet-stream",
          offset: 6929101,
          len: 239179,
        },
        "static/js/runtime-main.68d129c6.js": {
          filename: "static/js/runtime-main.68d129c6.js",
          contenttype: "text/javascript",
          offset: 14217227,
          len: 3546,
        },
        "static/js/runtime-main.68d129c6.js.map": {
          filename: "static/js/runtime-main.68d129c6.js.map",
          contenttype: "application/octet-stream",
          offset: 14220773,
          len: 16590,
        },
        "static/media/arrow-down-blue.cd061363.svg": {
          filename: "static/media/arrow-down-blue.cd061363.svg",
          contenttype: "image/svg+xml",
          offset: 219284,
          len: 326,
        },
        "static/media/arrow-down-grey.c0dedd2f.svg": {
          filename: "static/media/arrow-down-grey.c0dedd2f.svg",
          contenttype: "image/svg+xml",
          offset: 196726,
          len: 326,
        },
        "static/media/arrow-right-white.337ad716.png": {
          filename: "static/media/arrow-right-white.337ad716.png",
          contenttype: "image/png",
          offset: 197052,
          len: 12999,
        },
        "static/media/arrow-right.d285b6cf.svg": {
          filename: "static/media/arrow-right.d285b6cf.svg",
          contenttype: "image/svg+xml",
          offset: 289065,
          len: 263,
        },
        "static/media/circle-grey.ed2a1dad.svg": {
          filename: "static/media/circle-grey.ed2a1dad.svg",
          contenttype: "image/svg+xml",
          offset: 210213,
          len: 321,
        },
        "static/media/circle.2d975615.svg": {
          filename: "static/media/circle.2d975615.svg",
          contenttype: "image/svg+xml",
          offset: 210534,
          len: 321,
        },
        "static/media/coinbaseWalletIcon.62578f59.svg": {
          filename: "static/media/coinbaseWalletIcon.62578f59.svg",
          contenttype: "image/svg+xml",
          offset: 220450,
          len: 53626,
        },
        "static/media/dropdown-blue.b20914ec.svg": {
          filename: "static/media/dropdown-blue.b20914ec.svg",
          contenttype: "image/svg+xml",
          offset: 47369,
          len: 164,
        },
        "static/media/dropdown.7d32d2fa.svg": {
          filename: "static/media/dropdown.7d32d2fa.svg",
          contenttype: "image/svg+xml",
          offset: 287941,
          len: 164,
        },
        "static/media/dropup-blue.b96d70e1.svg": {
          filename: "static/media/dropup-blue.b96d70e1.svg",
          contenttype: "image/svg+xml",
          offset: 210051,
          len: 162,
        },
        "static/media/ethereum-logo.802c6eac.svg": {
          filename: "static/media/ethereum-logo.802c6eac.svg",
          contenttype: "image/svg+xml",
          offset: 219610,
          len: 840,
        },
        "static/media/magnifying-glass.67440097.svg": {
          filename: "static/media/magnifying-glass.67440097.svg",
          contenttype: "image/svg+xml",
          offset: 210855,
          len: 8429,
        },
        "static/media/metamask.023762b6.png": {
          filename: "static/media/metamask.023762b6.png",
          contenttype: "image/png",
          offset: 61600,
          len: 114217,
        },
        "static/media/plus-blue.e8021e51.svg": {
          filename: "static/media/plus-blue.e8021e51.svg",
          contenttype: "image/svg+xml",
          offset: 196237,
          len: 190,
        },
        "static/media/plus-grey.d8e0be7d.svg": {
          filename: "static/media/plus-grey.d8e0be7d.svg",
          contenttype: "image/svg+xml",
          offset: 288875,
          len: 190,
        },
        "static/media/portisIcon.b234b2bf.png": {
          filename: "static/media/portisIcon.b234b2bf.png",
          contenttype: "image/png",
          offset: 274076,
          len: 13865,
        },
        "static/media/question-mark.1ae4d9f4.svg": {
          filename: "static/media/question-mark.1ae4d9f4.svg",
          contenttype: "image/svg+xml",
          offset: 175817,
          len: 818,
        },
        "static/media/question.cc0a2451.svg": {
          filename: "static/media/question.cc0a2451.svg",
          contenttype: "image/svg+xml",
          offset: 288105,
          len: 770,
        },
        "static/media/spinner.be00fc4a.svg": {
          filename: "static/media/spinner.be00fc4a.svg",
          contenttype: "image/svg+xml",
          offset: 47533,
          len: 694,
        },
        "static/media/trustWallet.edcc1ab5.png": {
          filename: "static/media/trustWallet.edcc1ab5.png",
          contenttype: "image/png",
          offset: 176635,
          len: 19602,
        },
        "static/media/walletConnectIcon.8215855c.svg": {
          filename: "static/media/walletConnectIcon.8215855c.svg",
          contenttype: "image/svg+xml",
          offset: 48227,
          len: 13373,
        },
        "static/media/x.5b8e2186.svg": {
          filename: "static/media/x.5b8e2186.svg",
          contenttype: "image/svg+xml",
          offset: 196427,
          len: 299,
        },
      },
    },
    headers: {
      "skynet-skylink": "EADWpKD0myqH2tZa6xtKebg6kNnwYnI94fl4R8UKgNrmOA",
      "content-disposition": 'inline; filename="index.html"',
      "content-type": "text/html",
    },
  };

  skylinkVerification(done, linkInfo);
}

const developMomentumBodyHash = "08e96877dd6c99c3e1d98105f2fd9df377b53d65";
const developMomentumMetadata = require("../fixtures/developMomentumMetadata.json");

// developMomentumCheck returns the result of trying to download the skylink
// for the Develop Momentum Application
function developMomentumCheck(done) {
  const linkInfo = {
    name: "Develop Momentum Index File",
    skylink: "EAA1fG_ip4C1Vi1Ijvsr1oyr8jpH0Bo9HXya0T3kw-elGw/",
    bodyHash: developMomentumBodyHash,
    // metadata: developMomentumMetadata,
    headers: {
      "skynet-skylink": "EAA1fG_ip4C1Vi1Ijvsr1oyr8jpH0Bo9HXya0T3kw-elGw",
      "content-disposition": 'inline; filename="index.html"',
      "content-type": "text/html",
    },
  };

  skylinkVerification(done, linkInfo);
}

// developMomentumRedirectCheck returns the result of trying to download the skylink
// for the Develop Momentum Application without the tailing slash
function developMomentumRedirectCheck(done) {
  const linkInfo = {
    name: "Develop Momentum Index File - no trailing slash",
    skylink: "EAA1fG_ip4C1Vi1Ijvsr1oyr8jpH0Bo9HXya0T3kw-elGw",
    bodyHash: developMomentumBodyHash,
    metadata: developMomentumMetadata,
    headers: {
      "skynet-skylink": "EAA1fG_ip4C1Vi1Ijvsr1oyr8jpH0Bo9HXya0T3kw-elGw",
      "content-disposition": 'inline; filename="index.html"',
      "content-type": "text/html",
    },
  };

  skylinkVerification(done, linkInfo);
}

// developMomentumIndexFileCheck returns the result of trying to download the skylink
// for the Develop Momentum Application with a trailing /index.html
function developMomentumIndexFileCheck(done) {
  const linkInfo = {
    name: "Develop Momentum Index File",
    skylink: "EAA1fG_ip4C1Vi1Ijvsr1oyr8jpH0Bo9HXya0T3kw-elGw/index.html",
    bodyHash: developMomentumBodyHash,
    headers: {
      "skynet-skylink": "EAA1fG_ip4C1Vi1Ijvsr1oyr8jpH0Bo9HXya0T3kw-elGw",
      "content-disposition": 'inline; filename="index.html"',
      "content-type": "text/html",
    },
  };

  skylinkVerification(done, linkInfo);
}

// htmlExampleCheck returns the result of trying to download the skylink
// for the Example HTML file on siasky.net
function htmlExampleCheck(done) {
  const linkInfo = {
    name: "HTML Example",
    skylink: "PAL0w4SdA5rFCDGEutgpeQ50Om-YkBabtXVOJAkmedslKw",
    bodyHash: "ecffcfbb74e017698cad30a91a74b9ba0b046413",
    metadata: { filename: "introduction – Sia API Documentation.html" },
    headers: {
      "skynet-skylink": "PAL0w4SdA5rFCDGEutgpeQ50Om-YkBabtXVOJAkmedslKw",
      "content-disposition": 'inline; filename="introduction â\x80\x93 Sia API Documentation.html"',
      "content-type": "text/html; charset=utf-8",
    },
  };

  skylinkVerification(done, linkInfo);
}

// imageExampleCheck returns the result of trying to download the skylink
// for the Example image on siasky.net
function imageExampleCheck(done) {
  const linkInfo = {
    name: "Image Example",
    skylink: "IADUs8d9CQjUO34LmdaaNPK_STuZo24rpKVfYW3wPPM2uQ",
    bodyHash: "e318667a9d53a45a9d010ac4e0d120ad064279ac",
    metadata: { filename: "sia-lm.png" },
    headers: {
      "skynet-skylink": "IADUs8d9CQjUO34LmdaaNPK_STuZo24rpKVfYW3wPPM2uQ",
      "content-disposition": 'inline; filename="sia-lm.png"',
      "content-type": "image/png",
    },
  };

  skylinkVerification(done, linkInfo);
}

// jsonExampleCheck returns the result of trying to download the skylink
// for the Example JSON file on siasky.net
function jsonExampleCheck(done) {
  const linkInfo = {
    name: "JSON Example",
    skylink: "AAC0uO43g64ULpyrW0zO3bjEknSFbAhm8c-RFP21EQlmSQ",
    bodyHash: "b514603ce8acd937197712700e21259f18a857d6",
    metadata: { filename: "consensus.json" },
    headers: {
      "skynet-skylink": "AAC0uO43g64ULpyrW0zO3bjEknSFbAhm8c-RFP21EQlmSQ",
      "content-disposition": 'inline; filename="consensus.json"',
      "content-type": "application/json",
    },
  };

  skylinkVerification(done, linkInfo);
}

// pdfExampleCheck returns the result of trying to download the skylink
// for the Example PDF file on siasky.net
function pdfExampleCheck(done) {
  const linkInfo = {
    name: "PDF Example",
    skylink: "XABvi7JtJbQSMAcDwnUnmp2FKDPjg8_tTTFP4BwMSxVdEg",
    bodyHash: "7e079f7afc9e5bc0c1be04543e22ac552a14a8da",
    metadata: { filename: "sia.pdf" },
    headers: {
      "skynet-skylink": "XABvi7JtJbQSMAcDwnUnmp2FKDPjg8_tTTFP4BwMSxVdEg",
      "content-disposition": 'inline; filename="sia.pdf"',
      "content-type": "application/pdf",
    },
  };

  skylinkVerification(done, linkInfo);
}

// skyBayCheck returns the result of trying to download the skylink for the SkyBay Application.
function skyBayCheck(done) {
  const linkInfo = {
    name: "SkyBay",
    skylink: "EABkMjXzxJRpPz0eO0Or5fy2eo-rz3prdigGwRlyNd9mwA/",
    bodyHash: "dfc0b1d3d1113254d7545d19f6118855ed9c778b",
    metadata: {
      filename: "skybay.html",
      subfiles: { "skybay.html": { filename: "skybay.html", contenttype: "text/html", len: 11655 } },
    },
    headers: {
      "skynet-skylink": "EABkMjXzxJRpPz0eO0Or5fy2eo-rz3prdigGwRlyNd9mwA",
      "content-disposition": 'inline; filename="skybay.html"',
      "content-type": "text/html",
    },
  };

  skylinkVerification(done, linkInfo);
}

// skyBayRedirectCheck returns the result of trying to download the skylink
// for the SkyBay Application with no trailing slash.
function skyBayRedirectCheck(done) {
  const linkInfo = {
    name: "SkyBay Redirect",
    skylink: "EABkMjXzxJRpPz0eO0Or5fy2eo-rz3prdigGwRlyNd9mwA",
    bodyHash: "dfc0b1d3d1113254d7545d19f6118855ed9c778b",
    metadata: {
      filename: "skybay.html",
      subfiles: { "skybay.html": { filename: "skybay.html", contenttype: "text/html", len: 11655 } },
    },
    headers: {
      "skynet-skylink": "EABkMjXzxJRpPz0eO0Or5fy2eo-rz3prdigGwRlyNd9mwA",
      "content-disposition": 'inline; filename="skybay.html"',
      "content-type": "text/html",
    },
  };

  skylinkVerification(done, linkInfo);
}

// skyBinCheck returns the result of trying to download the skylink for the SkyBin Application.
function skyBinCheck(done) {
  const linkInfo = {
    name: "SkyBin",
    skylink: "CAAVU14pB9GRIqCrejD7rlS27HltGGiiCLICzmrBV0wVtA/",
    bodyHash: "858ff733c4cb06a80060b8a62cf303fd5a051651",
    metadata: { filename: "skybin.html" },
    headers: {
      "skynet-skylink": "CAAVU14pB9GRIqCrejD7rlS27HltGGiiCLICzmrBV0wVtA",
      "content-disposition": 'inline; filename="skybin.html"',
      "content-type": "text/html; charset=utf-8",
    },
  };

  skylinkVerification(done, linkInfo);
}

// skyBinRedirectCheck returns the result of trying to download the skylink
// for the SkyBin Application with no trailing slash.
function skyBinRedirectCheck(done) {
  const linkInfo = {
    name: "SkyBin Redirect",
    skylink: "CAAVU14pB9GRIqCrejD7rlS27HltGGiiCLICzmrBV0wVtA",
    bodyHash: "858ff733c4cb06a80060b8a62cf303fd5a051651",
    metadata: { filename: "skybin.html" },
    headers: {
      "skynet-skylink": "CAAVU14pB9GRIqCrejD7rlS27HltGGiiCLICzmrBV0wVtA",
      "content-disposition": 'inline; filename="skybin.html"',
      "content-type": "text/html; charset=utf-8",
    },
  };

  skylinkVerification(done, linkInfo);
}

const skyGalleryBodyHash = "cb5905023a29bdd60d58817f26503345c9a1bd09";
const skyGalleryMetadata = require("../fixtures/skygalleryMetadata.json");

// skyGalleryCheck returns the result of trying to download the skylink for the SkyGallery Application.
function skyGalleryCheck(done) {
  const linkInfo = {
    name: "SkyGallery",
    skylink: "AADW6GsQcetwDBaDYnGCSTbYjSKY743NtY1A5VRx5sj3Dg/",
    bodyHash: skyGalleryBodyHash,
    metadata: skyGalleryMetadata,
    headers: {
      "skynet-skylink": "AADW6GsQcetwDBaDYnGCSTbYjSKY743NtY1A5VRx5sj3Dg",
      "content-disposition": 'inline; filename="index.html"',
      "content-type": "text/html",
    },
  };

  skylinkVerification(done, linkInfo);
}

// skyGalleryIndexFileCheck returns the result of trying to download the skylink
// for the SkyGallery Application with a trailing /index.html
function skyGalleryIndexFileCheck(done) {
  const linkInfo = {
    name: "SkyGallery Index File",
    skylink: "AADW6GsQcetwDBaDYnGCSTbYjSKY743NtY1A5VRx5sj3Dg/index.html",
    bodyHash: skyGalleryBodyHash,
    headers: {
      "skynet-skylink": "AADW6GsQcetwDBaDYnGCSTbYjSKY743NtY1A5VRx5sj3Dg",
      "content-disposition": 'inline; filename="index.html"',
      "content-type": "text/html",
    },
  };

  skylinkVerification(done, linkInfo);
}

// skyGalleryRedirectCheck returns the result of trying to download the skylink
// for the SkyGallery Application with no trailing slash.
function skyGalleryRedirectCheck(done) {
  const linkInfo = {
    name: "SkyGallery Redirect",
    skylink: "AADW6GsQcetwDBaDYnGCSTbYjSKY743NtY1A5VRx5sj3Dg",
    bodyHash: skyGalleryBodyHash,
    metadata: skyGalleryMetadata,
    headers: {
      "skynet-skylink": "AADW6GsQcetwDBaDYnGCSTbYjSKY743NtY1A5VRx5sj3Dg",
      "content-disposition": 'inline; filename="index.html"',
      "content-type": "text/html",
    },
  };

  skylinkVerification(done, linkInfo);
}

// uncensoredLibraryCheck returns the result of trying to download the skylink
// for the uncensored library skylink
function uncensoredLibraryCheck(done) {
  const linkInfo = {
    name: "Unzip The Uncensored Library Map",
    skylink: "AAC5glnZyNJ4Ieb4MhnYJGtID6qdMqEjl0or5EvEMt7bWQ",
    bodyHash: "cd0377661eefd656c8b46c497aa03112393ba893",
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
    headers: {
      "skynet-skylink": "AAC5glnZyNJ4Ieb4MhnYJGtID6qdMqEjl0or5EvEMt7bWQ",
      "content-disposition": 'inline; filename="Unzip_The_Uncensored_Library_Map.zip"',
      "content-type": "application/zip",
    },
  };

  skylinkVerification(done, linkInfo);
}

function uncensoredLibraryPressReleaseCheck(done) {
  const linkInfo = {
    name: "The Uncensored Library - Press Release",
    skylink: "AABHwuml_EhvyY8Gm7j1E2xGwodUNAJgX0A6-Cd22p9kNA",
    bodyHash: "da39a3ee5e6b4b0d3255bfef95601890afd80709",
    metadata: {
      filename: "press-release-Reporters-Without-Borders-The-Uncensored-Library.zip",
      subfiles: {
        "press-release-Reporters-Without-Borders-The-Uncensored-Library.zip": {
          filename: "press-release-Reporters-Without-Borders-The-Uncensored-Library.zip",
          contenttype: "application/zip",
          len: 383501533,
        },
      },
    },
    headers: {
      "skynet-skylink": "AABHwuml_EhvyY8Gm7j1E2xGwodUNAJgX0A6-Cd22p9kNA",
      "content-disposition": 'inline; filename="press-release-Reporters-Without-Borders-The-Uncensored-Library.zip"',
      "content-type": "application/zip",
    },
  };

  // request too large, use head just to verify the headers
  skylinkVerification(done, linkInfo, { method: "head" });
}

function uncensoredLibraryV2Check(done) {
  const linkInfo = {
    name: "The Uncensored Library V2",
    skylink: "AAAs-JOsRGWgABYIo7AwTDqSX79-BxQKjDj0wiRGoRPFnw",
    bodyHash: "f2a802c2b7482825613a08853538203a53c96bd1",
    metadata: {
      filename: "The Uncensored Library V2.zip",
      subfiles: {
        "The Uncensored Library V2.zip": {
          filename: "The Uncensored Library V2.zip",
          contenttype: "application/zip",
          len: 101262134,
        },
      },
    },
    headers: {
      "skynet-skylink": "AAAs-JOsRGWgABYIo7AwTDqSX79-BxQKjDj0wiRGoRPFnw",
      "content-disposition": 'inline; filename="The Uncensored Library V2.zip"',
      "content-type": "application/zip",
    },
  };

  skylinkVerification(done, linkInfo);
}

function bitcoinWhitepaper(done) {
  skylinkVerification(done, {
    name: "Bitcoin Whitepaper",
    skylink: "3ACpC9Umme41zlWUgMQh1fw0sNwgWwyfDDhRQ9Sppz9hjQ",
    bodyHash: "8de2fdb04edce612738eb51e14ecc426381f8ed8",
    headers: {
      "skynet-skylink": "3ACpC9Umme41zlWUgMQh1fw0sNwgWwyfDDhRQ9Sppz9hjQ",
      "content-disposition": 'inline; filename="bitcoin.pdf"',
      "content-type": "application/pdf",
    },
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

// uniswapHNSResolverCheck returns the result of trying to download the skylink
// for the Uniswap Application via the HNS resolver endpoint
function uniswapHNSResolverCheck(done) {
  const linkInfo = {
    name: "Uniswap HNS Resolver",
    skylink: "hnsres/uniswap-dex/",
    bodyHash: "3634496800c254b93f9dcbca2aeb53e644f706c0",
  };

  skylinkVerification(done, linkInfo);
}

// uniswapHNSResolverRedirectCheck returns the result of trying to download the skylink
// for the Uniswap Application via the HNS resolver endpoint without the
// trailing slash
function uniswapHNSResolverRedirectCheck(done) {
  const linkInfo = {
    name: "Uniswap HNS Resolver Redirect",
    skylink: "hnsres/uniswap-dex",
    bodyHash: "3634496800c254b93f9dcbca2aeb53e644f706c0",
  };

  skylinkVerification(done, linkInfo);
}

// check whether content disposition is set correctly for downloads
function fileEndpointCheck(done) {
  const linkInfo = {
    name: "File endpoint check",
    skylink: "file/XABvi7JtJbQSMAcDwnUnmp2FKDPjg8_tTTFP4BwMSxVdEg",
    bodyHash: "7e079f7afc9e5bc0c1be04543e22ac552a14a8da",
    // metadata: { filename: "sia2.pdf" },
    headers: {
      "skynet-skylink": "XABvi7JtJbQSMAcDwnUnmp2FKDPjg8_tTTFP4BwMSxVdEg",
      "content-disposition": 'attachment; filename="sia.pdf"',
      "content-type": "application/pdf",
    },
  };

  skylinkVerification(done, linkInfo);
}

// check whether hns/note-to-self would properly redirect to note-to-self/
function hnsEndpointDirectoryRedirect(done) {
  const expected = {
    name: "hns endpoint directory redirect",
    skylink: "hns/note-to-self",
    statusCode: 307,
    headers: {
      location: "note-to-self/",
    },
  };

  skylinkVerification(done, expected, { followRedirect: false });
}

function skappSkySend(done) {
  skylinkVerification(done, {
    name: "skysend.hns",
    source: "https://github.com/redsolver/skysend/",
    skylink: "GADlWH3ALR2g1cDUBI6Ti8B22iD7R5dfn_8jLfq-atm5iw",
    bodyHash: "35bc25301501a3b28913ca7a7a06120681365a9c",
    headers: {
      "skynet-skylink": "GADlWH3ALR2g1cDUBI6Ti8B22iD7R5dfn_8jLfq-atm5iw",
      "content-disposition": 'inline; filename="index.html"',
      "content-type": "text/html",
    },
  });
}

function skappNoteToSelf(done) {
  skylinkVerification(done, {
    name: "note-to-self.hns",
    source: "https://github.com/kwypchlo/note-to-self/",
    skylink: "EAD_w2YcqtpqVgtRwKXPno9VmKfTcVG3E_OIL-Np_Hz_1g",
    bodyHash: "e00c1b7348dd419e96bf3c188185a5fb8d04af53",
    headers: {
      "skynet-skylink": "EAD_w2YcqtpqVgtRwKXPno9VmKfTcVG3E_OIL-Np_Hz_1g",
      "content-disposition": 'inline; filename="index.html"',
      "content-type": "text/html",
    },
  });
}

function skappUniswap(done) {
  skylinkVerification(done, {
    name: "uniswap skynet labs fork",
    source: "https://github.com/SkynetLabs/uniswap-interface/",
    skylink: "OAAy4_g9EYfuOiUZlz_irkoPgsc_seAjgGozerrT1QvE5A",
    bodyHash: "db2882b7902f24d62e49905b77d536aaf7b7da75",
    headers: {
      "skynet-skylink": "OAAy4_g9EYfuOiUZlz_irkoPgsc_seAjgGozerrT1QvE5A",
      "content-disposition": 'inline; filename="index.html"',
      "content-type": "text/html",
    },
  });
}

function skappHackerPaste(done) {
  skylinkVerification(done, {
    name: "hackerpaste.hns",
    source: "https://github.com/harej/hackerpaste/",
    skylink: "_AGZuZCyRn5kZMFHBssWYc20poXyez1XMO6hmPqAVcM1qg",
    bodyHash: "12817ac933b7f64fc63ae24a652132ed11e5b622",
    headers: {
      "skynet-skylink": "_AGZuZCyRn5kZMFHBssWYc20poXyez1XMO6hmPqAVcM1qg",
      "content-disposition": 'inline; filename="index.html"',
      "content-type": "text/html",
    },
  });
}

function skappHowAboutSkapp(done) {
  skylinkVerification(done, {
    name: "tirthahalli.hns",
    source: "-",
    skylink: "AAAsdvGalu2Fj9P5zLvZhfwoI0CpXeO_kPMSG_YU1PSIWg",
    bodyHash: "734c49ddde2a49ac6ddbf1c6d90a014ff82e2f87",
    headers: {
      "skynet-skylink": "AAAsdvGalu2Fj9P5zLvZhfwoI0CpXeO_kPMSG_YU1PSIWg",
      "content-disposition": 'inline; filename="index.html"',
      "content-type": "text/html",
    },
  });
}

function skappSkyDeploy(done) {
  skylinkVerification(done, {
    name: "sky-deploy.hns",
    source: "-",
    skylink: "CABR1ic_lIPaN9JYLG6AiudkW5GShRd-Cr6Wkjur7z29Rw",
    bodyHash: "b2b0498a8a7f6fcfe76c29ae1a1176b4e64cb5ab",
    headers: {
      "skynet-skylink": "CABR1ic_lIPaN9JYLG6AiudkW5GShRd-Cr6Wkjur7z29Rw",
      "content-disposition": 'inline; filename="index.html"',
      "content-type": "text/html",
    },
  });
}

function parseHeaderString(header) {
  try {
    return JSON.parse(header);
  } catch {
    return header;
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
  skyBayCheck,
  skyBayRedirectCheck,
  skyBinCheck,
  skyBinRedirectCheck,
  skyGalleryCheck,
  skyGalleryIndexFileCheck,
  skyGalleryRedirectCheck,
  uncensoredLibraryCheck,
  uncensoredLibraryPressReleaseCheck,
  uncensoredLibraryV2Check,
  fileEndpointCheck,
  bitcoinWhitepaper,
  // uniswapIndexFileCheck,
  // uniswapCheck,
  // uniswapRedirectCheck,
  // uniswapHNSCheck,
  // uniswapHNSRedirectCheck,
  uniswapHNSResolverCheck,
  uniswapHNSResolverRedirectCheck,
  hnsEndpointDirectoryRedirect,
  skappSkySend,
  skappNoteToSelf,
  skappUniswap,
  skappHackerPaste,
  skappHowAboutSkapp,
  skappSkyDeploy,
];
