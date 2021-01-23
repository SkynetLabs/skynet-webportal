const superagent = require("superagent");
const hash = require("object-hash");
const { detailedDiff } = require("deep-object-diff");
const { isEqual } = require("lodash");
const { calculateElapsedTime, ensureValidJSON, getResponseContent } = require("../utils");

// audioExampleCheck returns the result of trying to download the skylink
// for the Example audio file on siasky.net
function audioExampleCheck(done) {
  const linkInfo = {
    name: "Audio Example",
    skylink: "_A2zt5SKoqwnnZU4cBF8uBycSKULXMyeg1c5ZISBr2Q3dA",
    bodyHash: "be335f5ad9bc357248f3d35c7e49df491afb6b12",
    headers: {
      "skynet-skylink": "_A2zt5SKoqwnnZU4cBF8uBycSKULXMyeg1c5ZISBr2Q3dA",
      "skynet-file-metadata": { filename: "feel-good.mp3" },
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
    bodyHash: "81b9fb74829a96ceafa429840d1ef0ce44376ddd",
    headers: {
      "skynet-skylink": "PAMZVmfutxWoG6Wnl5BRKuWLkDNZR42k_okRRvksJekA3A",
      "skynet-file-metadata": {
        filename: "An Effective Treatment for Coronavirus (COVID-19).pdf",
        subfiles: {
          "An Effective Treatment for Coronavirus (COVID-19).pdf": {
            filename: "An Effective Treatment for Coronavirus (COVID-19).pdf",
            contenttype: "application/pdf",
            len: 474803,
          },
        },
      },
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
    bodyHash: "901f6fd65ef595f70b6bfebbb2d05942351ef2b3",
    headers: {
      "skynet-skylink": "bACLKGmcmX4NCp47WwOOJf0lU666VLeT5HRWpWVtqZPjEA",
      "skynet-file-metadata": { filename: "coronope.pdf" },
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
    bodyHash: "d6ad2506590bb45b5acc6a8a964a3da4d657354f",
    headers: {
      "skynet-skylink": "EADWpKD0myqH2tZa6xtKebg6kNnwYnI94fl4R8UKgNrmOA",
      "skynet-file-metadata": {
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
      "content-disposition": 'inline; filename="build"',
      "content-type": "text/html",
    },
  };

  skylinkVerification(done, linkInfo);
}

const developMomentumBodyHash = "53b44a9d3cfa9b3d66ce5c29976f4383725d3652";
const developMomentumMetadata = require("../fixtures/developMomentumMetadata.json");

// developMomentumCheck returns the result of trying to download the skylink
// for the Develop Momentum Application
function developMomentumCheck(done) {
  const linkInfo = {
    name: "Develop Momentum Index File",
    skylink: "EAA1fG_ip4C1Vi1Ijvsr1oyr8jpH0Bo9HXya0T3kw-elGw/",
    bodyHash: developMomentumBodyHash,
    headers: {
      "skynet-skylink": "EAA1fG_ip4C1Vi1Ijvsr1oyr8jpH0Bo9HXya0T3kw-elGw",
      "skynet-file-metadata": developMomentumMetadata,
      "content-disposition": 'inline; filename="output"',
      "content-type": "text/html",
    },
  };

  skylinkVerification(done, linkInfo);
}

// developMomentumRedirectCheck returns the result of trying to download the skylink
// for the Develop Momentum Application without the tailing slash
function developMomentumRedirectCheck(done) {
  const linkInfo = {
    name: "Develop Momentum Index File",
    skylink: "EAA1fG_ip4C1Vi1Ijvsr1oyr8jpH0Bo9HXya0T3kw-elGw",
    bodyHash: developMomentumBodyHash,
    headers: {
      "skynet-skylink": "EAA1fG_ip4C1Vi1Ijvsr1oyr8jpH0Bo9HXya0T3kw-elGw",
      "skynet-file-metadata": developMomentumMetadata,
      "content-disposition": 'inline; filename="output"',
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
      "skynet-file-metadata": {
        filename: "/index.html",
        length: 4981,
        subfiles: { "index.html": { filename: "index.html", contenttype: "text/html", len: 4981 } },
      },
      "content-disposition": 'inline; filename="index.html"',
      "content-type": "text/html; charset=utf-8",
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
    bodyHash: "c932fd56f98b6db589e56be8018817f13bb29f72",
    headers: {
      "skynet-skylink": "PAL0w4SdA5rFCDGEutgpeQ50Om-YkBabtXVOJAkmedslKw",
      "skynet-file-metadata": { filename: "introduction â\x80\x93 Sia API Documentation.html" },
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
    bodyHash: "313207978d0a88bf2b961f098804e9ab0f82837f",
    headers: {
      "skynet-skylink": "IADUs8d9CQjUO34LmdaaNPK_STuZo24rpKVfYW3wPPM2uQ",
      "skynet-file-metadata": { filename: "sia-lm.png" },
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
    bodyHash: "198771c3d07d5c7302aadcc0697a7298e5e8ccc3",
    headers: {
      "skynet-skylink": "AAC0uO43g64ULpyrW0zO3bjEknSFbAhm8c-RFP21EQlmSQ",
      "skynet-file-metadata": { filename: "consensus.json" },
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
    bodyHash: "9bd8162e1575569a9041972f7f62d65887063dc3",
    headers: {
      "skynet-skylink": "XABvi7JtJbQSMAcDwnUnmp2FKDPjg8_tTTFP4BwMSxVdEg",
      "skynet-file-metadata": { filename: "sia.pdf" },
      "content-disposition": 'inline; filename="sia.pdf"',
      "content-type": "application/pdf",
    },
  };

  skylinkVerification(done, linkInfo);
}

// randomImageCheck returns the result of trying to download the skylink for
// a Random Image.
function randomImageCheck(done) {
  const linkInfo = {
    name: "Random Image",
    skylink: "PAHx7JmsU9EFGbqm5q0LNKT2wKfoJ_mhPI8zWlNEXZ8uOQ/",
    bodyHash: "4c73c5a0eddd5823be677d7f93bf80cc9338ee9f",
    headers: {
      "skynet-skylink": "PAHx7JmsU9EFGbqm5q0LNKT2wKfoJ_mhPI8zWlNEXZ8uOQ",
      "skynet-file-metadata": {
        filename: "30355444.png",
        subfiles: { "30355444.png": { filename: "30355444.png", contenttype: "image/png", len: 350473 } },
        defaultpath: "/30355444.png",
      },
      "content-disposition": 'inline; filename="30355444.png"',
      "content-type": "image/png",
    },
  };

  skylinkVerification(done, linkInfo);
}

// randomImageRedirectCheck returns the result of trying to download the skylink for
// a Random Image with no trailing slash.
function randomImageRedirectCheck(done) {
  const linkInfo = {
    name: "Random Image Redirect",
    skylink: "PAHx7JmsU9EFGbqm5q0LNKT2wKfoJ_mhPI8zWlNEXZ8uOQ",
    bodyHash: "4c73c5a0eddd5823be677d7f93bf80cc9338ee9f",
    headers: {
      "skynet-skylink": "PAHx7JmsU9EFGbqm5q0LNKT2wKfoJ_mhPI8zWlNEXZ8uOQ",
      "skynet-file-metadata": {
        filename: "30355444.png",
        subfiles: { "30355444.png": { filename: "30355444.png", contenttype: "image/png", len: 350473 } },
        defaultpath: "/30355444.png",
      },
      "content-disposition": 'inline; filename="30355444.png"',
      "content-type": "image/png",
    },
  };

  skylinkVerification(done, linkInfo);
}

// skyBayCheck returns the result of trying to download the skylink for the SkyBay Application.
function skyBayCheck(done) {
  const linkInfo = {
    name: "SkyBay",
    skylink: "EABkMjXzxJRpPz0eO0Or5fy2eo-rz3prdigGwRlyNd9mwA/",
    bodyHash: "25d63937c9734fb08d2749c6517d1b3de8ecb856",
    headers: {
      "skynet-skylink": "EABkMjXzxJRpPz0eO0Or5fy2eo-rz3prdigGwRlyNd9mwA",
      "skynet-file-metadata": {
        filename: "skybay.html",
        subfiles: { "skybay.html": { filename: "skybay.html", contenttype: "text/html", len: 11655 } },
      },
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
    bodyHash: "25d63937c9734fb08d2749c6517d1b3de8ecb856",
    headers: {
      "skynet-skylink": "EABkMjXzxJRpPz0eO0Or5fy2eo-rz3prdigGwRlyNd9mwA",
      "skynet-file-metadata": {
        filename: "skybay.html",
        subfiles: { "skybay.html": { filename: "skybay.html", contenttype: "text/html", len: 11655 } },
      },
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
    bodyHash: "767ec67c417e11b97c5db7dad9ea3b6b27cb0d39",
    headers: {
      "skynet-skylink": "CAAVU14pB9GRIqCrejD7rlS27HltGGiiCLICzmrBV0wVtA",
      "skynet-file-metadata": { filename: "skybin.html" },
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
    bodyHash: "767ec67c417e11b97c5db7dad9ea3b6b27cb0d39",
    headers: {
      "skynet-skylink": "CAAVU14pB9GRIqCrejD7rlS27HltGGiiCLICzmrBV0wVtA",
      "skynet-file-metadata": { filename: "skybin.html" },
      "content-disposition": 'inline; filename="skybin.html"',
      "content-type": "text/html; charset=utf-8",
    },
  };

  skylinkVerification(done, linkInfo);
}

const skyGalleryBodyHash = "077e54054748d278114f1870f8045a162eb73641";
const skyGalleryMetadata = require("../fixtures/skygalleryMetadata.json");

// skyGalleryCheck returns the result of trying to download the skylink for the SkyGallery Application.
function skyGalleryCheck(done) {
  const linkInfo = {
    name: "SkyGallery",
    skylink: "AADW6GsQcetwDBaDYnGCSTbYjSKY743NtY1A5VRx5sj3Dg/",
    bodyHash: skyGalleryBodyHash,
    headers: {
      "skynet-skylink": "AADW6GsQcetwDBaDYnGCSTbYjSKY743NtY1A5VRx5sj3Dg",
      "skynet-file-metadata": skyGalleryMetadata,
      "content-disposition": 'inline; filename="skygallery-v0.1.1-76c4c115fcb526716b2564568850f433"',
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
      "skynet-file-metadata": {
        filename: "/index.html",
        length: 2534,
        subfiles: { "index.html": { filename: "index.html", contenttype: "text/html", len: 2534 } },
      },
      "content-disposition": 'inline; filename="index.html"',
      "content-type": "text/html; charset=utf-8",
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
    headers: {
      "skynet-skylink": "AADW6GsQcetwDBaDYnGCSTbYjSKY743NtY1A5VRx5sj3Dg",
      "skynet-file-metadata": skyGalleryMetadata,
      "content-disposition": 'inline; filename="skygallery-v0.1.1-76c4c115fcb526716b2564568850f433"',
      "content-type": "text/html",
    },
  };

  skylinkVerification(done, linkInfo);
}

// uncensoredLibraryCheck returns the result of trying to download the skylink
// for the uncensored library skylink
function uncensoredLibraryCheck(done) {
  const linkInfo = {
    name: "Uncensored Library",
    skylink: "AAC5glnZyNJ4Ieb4MhnYJGtID6qdMqEjl0or5EvEMt7bWQ",
    bodyHash: "60da6cb958699c5acd7f2a2911656ff32fca89a7",
    headers: {
      "skynet-skylink": undefined,
      "skynet-file-metadata": {
        filename: "Unzip_The_Uncensored_Library_Map.zip",
        subfiles: {
          "Unzip_The_Uncensored_Library_Map.zip": {
            filename: "Unzip_The_Uncensored_Library_Map.zip",
            contenttype: "application/zip",
            len: 76744822,
          },
        },
      },
      "content-disposition": 'attachment; filename="Unzip_The_Uncensored_Library_Map.zip"',
      "content-type": "application/octet-stream",
    },
  };

  skylinkVerification(done, linkInfo);
}

function bitcoinWhitepaper(done) {
  skylinkVerification(done, {
    name: "Bitcoin Whitepaper",
    skylink: "3ACpC9Umme41zlWUgMQh1fw0sNwgWwyfDDhRQ9Sppz9hjQ",
    bodyHash: "5d1fd2c37c1a3409cfc41861f4206472559670f3",
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
    bodyHash: "44a3f0f56861ae841a6cb19cb0b3edf98ad610f8",
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
    bodyHash: "44a3f0f56861ae841a6cb19cb0b3edf98ad610f8",
  };

  skylinkVerification(done, linkInfo);
}

// check whether content disposition is set correctly for downloads
function fileEndpointCheck(done) {
  const linkInfo = {
    name: "File endpoint check",
    skylink: "file/XABvi7JtJbQSMAcDwnUnmp2FKDPjg8_tTTFP4BwMSxVdEg",
    bodyHash: "9bd8162e1575569a9041972f7f62d65887063dc3",
    headers: {
      "skynet-skylink": "XABvi7JtJbQSMAcDwnUnmp2FKDPjg8_tTTFP4BwMSxVdEg",
      "skynet-file-metadata": { filename: "sia.pdf" },
      "content-disposition": 'attachment; filename="sia.pdf"',
      "content-type": "application/pdf",
    },
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

// skylinkVerification verifies a skylink against provided information.
function skylinkVerification(done, { name, skylink, bodyHash, headers }) {
  const time = process.hrtime();

  // Create the query for the skylink
  const query = `https://${process.env.PORTAL_URL}/${skylink}?nocache=true`;

  // Get the Skylink
  superagent
    .get(query)
    .responseType("blob")
    .then(
      (response) => {
        const entry = { name, up: true, statusCode: response.statusCode, time: calculateElapsedTime(time) };
        const info = {};

        // Check if the response body is valid by checking against the known hash
        const currentBodyHash = hash(response.body);
        if (currentBodyHash !== bodyHash) {
          entry.up = false;
          info.bodyHash = { expected: bodyHash, current: currentBodyHash };
        }

        if (headers) {
          Object.entries(headers).forEach(([headerName, expectedHeader]) => {
            const currentHeader = parseHeaderString(response.header[headerName]);
            if (!isEqual(currentHeader, expectedHeader)) {
              entry.up = false;

              info.headers = info.headers ?? {};
              if (typeof currentHeader === "object") {
                info.headers[headerName] = ensureValidJSON(detailedDiff(expectedHeader, currentHeader));
              } else {
                info.headers[headerName] = currentHeader;
              }
            }
          });
        }

        if (Object.keys(info).length) entry.info = info; // add info only if it exists

        done(entry); // Return the entry information
      },
      (error) => {
        done({
          name,
          up: false,
          statusCode: error.statusCode || error.status,
          errorResponseContent: getResponseContent(error.response),
          time: calculateElapsedTime(time),
        });
      }
    );
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
  fileEndpointCheck,
  bitcoinWhitepaper,
  // uniswapIndexFileCheck,
  // uniswapCheck,
  // uniswapRedirectCheck,
  // uniswapHNSCheck,
  // uniswapHNSRedirectCheck,
  uniswapHNSResolverCheck,
  uniswapHNSResolverRedirectCheck,
];
