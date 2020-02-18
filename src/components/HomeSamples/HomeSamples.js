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
  { type: "Video", url: "/CABAB_1Dt0FJsxqsu_J4TodNCbCGvtFf1Uys_3EgzOlTcg" },
  { type: "JSON", url: "/AAC0uO43g64ULpyrW0zO3bjEknSFbAhm8c-RFP21EQlmSQ" }
  // { type: "Dapps", url: "#" }
];

export default function HomeSamples() {
  return (
    <div className="home-samples">
      <Fade duration={700} distance="40px" bottom>
        <p>
          Skynet includes SDKs for popular programming languages that integrate seamlessly with your existing apps.
          Above are some code snippets for uploading and retrieving data.
        </p>
      </Fade>

      <Reveal effect="active">
        <div className="home-samples-samples">
          {samples.map((sample, i) => (
            <Sample className={`fadeInUp delay${i + 1}`} key={`${i}-${sample.url}`} {...sample} />
          ))}
        </div>
      </Reveal>
    </div>
  );
}
