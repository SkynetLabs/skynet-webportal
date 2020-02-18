import React from "react";
import Fade from "react-reveal/Fade";

import "./HomeBuilt.scss";
import { CircleIcon, CodeExamples } from "../";
import { Cylinder, SmallOrb } from "../../svg";

export default function HomeBuilt() {
  return (
    <div className="home-built">
      <header className="home-built-header">
        <Fade duration={700} distance="40px" bottom>
          <div className="home-built-divider">
            <div className="small-divider" />
            <div className="divider" />
            <SmallOrb className="small-orb" />
            <CircleIcon>
              <Cylinder />
            </CircleIcon>
            <SmallOrb className="small-orb" />
            <div className="divider" />
            <div className="small-divider" />
          </div>
        </Fade>
        <Fade duration={700} distance="40px" bottom>
          <h2>
            Infrastructure built for
            <br />
            <strong>application developers</strong>
          </h2>
        </Fade>
      </header>

      <Fade duration={700} distance="40px" bottom>
        <div className="code-examples">
          <h3 className="code-examples-title">Uploading</h3>
          <CodeExamples type="upload"/>
        </div>

        <div className="code-examples">
          <h3 className="code-examples-title">Downloading</h3>
          <CodeExamples type="download"/>
        </div>
      </Fade>
    </div>
  );
}
