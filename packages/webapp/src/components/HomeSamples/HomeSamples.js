import React from "react";

import "./HomeSamples.scss";
import { Sample } from "../";

const samples = [
  { type: "HTML", url: "/PAL0w4SdA5rFCDGEutgpeQ50Om-YkBabtXVOJAkmedslKw" },
  { type: "PDF", url: "/XABvi7JtJbQSMAcDwnUnmp2FKDPjg8_tTTFP4BwMSxVdEg" },
  { type: "Image", url: "/IADUs8d9CQjUO34LmdaaNPK_STuZo24rpKVfYW3wPPM2uQ" },
  { type: "Audio", url: "/_A2zt5SKoqwnnZU4cBF8uBycSKULXMyeg1c5ZISBr2Q3dA" },
  { type: "Video", url: "/CACqf4NlIMlA0CCCieYGjpViPGyfyJ4v1x3bmuCKZX8FKA" },
  { type: "JSON", url: "/AAC0uO43g64ULpyrW0zO3bjEknSFbAhm8c-RFP21EQlmSQ" },
  { type: "Dapp", url: "/IAC6CkhNYuWZqMVr1gob1B6tPg4MrBGRzTaDvAIAeu9A9w/" },
];

export default function HomeSamples() {
  return (
    <div className="home-samples">
      <p>Above are some code snippets for uploading and retrieving data.</p>
      <p>
        Skynet includes{" "}
        <a href="https://nebulouslabs.github.io/skynet-docs" target="_blank" rel="noopener noreferrer" className="link">
          SDKs
        </a>{" "}
        for popular programming languages and{" "}
        <a href="https://sia.tech/docs/#skynet" target="_blank" rel="noopener noreferrer" className="link">
          APIs
        </a>{" "}
        that integrate seamlessly with your existing apps. You can follow these guides to start using Skynet with{" "}
        <a href="https://github.com/NebulousLabs/skynet-cli" target="_blank" rel="noopener noreferrer" className="link">
          the Skynet CLI
        </a>{" "}
        and{" "}
        <a
          href="https://blog.sia.tech/the-skynet-sdks-751b35578b20"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          integrate Skynet
        </a>{" "}
        into your application.
      </p>

      <div className="home-samples-samples">
        {samples.map((sample, i) => (
          <Sample key={`${i}-${sample.url}`} {...sample} />
        ))}
      </div>
    </div>
  );
}
