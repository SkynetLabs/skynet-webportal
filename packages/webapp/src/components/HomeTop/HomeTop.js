import React from "react";
import { boolean } from "boolean";
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

      {boolean(process.env.GATSBY_WITH_ACCOUNTS) && (
        <p className="auth-links">
          <a href="/account/auth/registration" className="link">
            Sign up now!
          </a>{" "}
          Already have an account? Go to your{" "}
          <a href="/account/" className="link">
            dashboard
          </a>
        </p>
      )}

      <Deco1 className="deco-1" />
      <Deco2 className="deco-2" />
    </div>
  );
}
