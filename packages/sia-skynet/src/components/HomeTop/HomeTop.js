import React from "react";
import Reveal from "react-reveal/Reveal";

import "./HomeTop.scss";
import { Skynet, Deco1, Deco2 } from "../../svg";

export default function HomeTop() {
  return (
    <Reveal effect="active">
      <div className="home-top">
        <Skynet className="logo" />

        <h1 className="fadeInUp delay2">Build the Future Web.</h1>

        <p className="fadeInUp delay3">
          Skynet is a decentralized file sharing and content distribution
          protocol.
        </p>

        <Deco1 className="deco-1 fadeInUp delay6" />
        <Deco2 className="deco-2 fadeInUp delay6" />
      </div>
    </Reveal>
  );
}
