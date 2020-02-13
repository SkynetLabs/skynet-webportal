import React from "react";
import Fade from "react-reveal/Fade";
import Reveal from "react-reveal/Reveal";

import "./HomeSamples.scss";
import { Sample } from "../";

const samples = [
  { type: "HTML", url: "/PAJF7fi2dK0CpcrhcXXReyufMO2s8k25sWL_XQjBW5a0mA" },
  { type: "PDF", url: "/XABvi7JtJbQSMAcDwnUnmp2FKDPjg8_tTTFP4BwMSxVdEg" },
  { type: "Image", url: "/IADUs8d9CQjUO34LmdaaNPK_STuZo24rpKVfYW3wPPM2uQ" },
  { type: "Audio", url: "/_A2zt5SKoqwnnZU4cBF8uBycSKULXMyeg1c5ZISBr2Q3dA" },
  { type: "Video", url: "/CABtmZJhzqf2unWUxKndMtpRri8IyqS_QV5Xg4PIQhBgtQ" },
  { type: "JSON", url: "/AAC0uO43g64ULpyrW0zO3bjEknSFbAhm8c-RFP21EQlmSQ" },
  // { type: "Dapps", url: "#" }
];

export default function HomeSamples() {
  return (
    <div className="home-samples">
      <Fade duration={700} distance="40px" bottom>
        <p>
          Skynet has SDKs for popular programming languages which integrate
          seamlessly with existing applications. Above are a few code snippets
          for uploading and downloading data from Skynet.
        </p>
      </Fade>

      <Reveal effect="active">
        <div className="home-samples-samples">
          {samples.map((sample, i) => (
            <Sample
              className={`fadeInUp delay${i + 1}`}
              key={`${i}-${sample.url}`}
              {...sample}
            />
          ))}
        </div>
      </Reveal>
    </div>
  );
}
