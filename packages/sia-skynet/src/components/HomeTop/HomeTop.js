import React from "react";
import Reveal from "react-reveal/Reveal";
import logo from '../../images/logo.png';
import "./HomeTop.scss";
import { Skynet, Deco1, Deco2 } from "../../svg";

export default function HomeTop() {
  return (
    <Reveal effect="active">
      <div className="home-top">
        <img src={logo} alt="Skynet logo" className="logo"/>
        <Skynet className="wordmark" />

        <h1 className="fadeInUp delay2">Build a Free Internet.</h1>

        <p className="fadeInUp delay3">
          The decentralized CDN and file sharing platform for devs.
          Skynet is the storage foundation for a Free Internet!
        </p>

        <Deco1 className="deco-1 fadeInUp delay6" />
        <Deco2 className="deco-2 fadeInUp delay6" />
      </div>
    </Reveal>
  );
}
