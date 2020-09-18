import React from "react";

import "./HomeBuilt.scss";
import { CircleIcon, CodeExamples } from "../";
import { Cylinder, SmallOrb } from "../../svg";

export default function HomeBuilt() {
  return (
    <div className="home-built">
      <header className="home-built-header">
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
        <h2>
          Infrastructure built for
          <br />
          <strong>application developers</strong>
        </h2>
      </header>

      <CodeExamples />
    </div>
  );
}
