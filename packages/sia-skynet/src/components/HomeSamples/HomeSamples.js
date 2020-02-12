import React from "react";
import Fade from "react-reveal/Fade";
import Reveal from "react-reveal/Reveal";

import "./HomeSamples.scss";
import { Sample } from "../";

const samples = [
  { type: "HTML", url: "#" },
  { type: "PDF", url: "#" },
  { type: "Image", url: "#" },
  { type: "Audio", url: "#" },
  { type: "Video", url: "#" },
  { type: "JSON", url: "#" },
  { type: "Dapps", url: "#" }
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
