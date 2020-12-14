import React from "react";
import logo from "../../images/logo.svg";
import "./HomeTop.scss";
import { Skynet, Deco1, Deco2 } from "../../svg";

export default function HomeTop() {
  return (
    <div className="home-top">
      <img src={logo} alt="Skynet logo" className="logo" />
      <Skynet className="wordmark" />

      <h1>Build a Free Internet.</h1>

      <p>
        The decentralized CDN and file sharing platform for devs. Skynet is the storage foundation for a Free Internet!
      </p>

      <p className="auth-links">
        <a href="/secure/auth/registration" className="link">
          Sign up now!
        </a>{" "}
        Already have an account?{" "}
        <a href="/secure/auth/login" className="link">
          Log in!
        </a>
      </p>

      <Deco1 className="deco-1" />
      <Deco2 className="deco-2" />
    </div>
  );
}
