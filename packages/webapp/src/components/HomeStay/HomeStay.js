import React, { Component } from "react";

import "./HomeStay.scss";
import { SocialLink, CircleIcon, Mailing } from "../";
import { SmallOrb, Pyramid } from "../../svg";

export default class HomeStay extends Component {
  render() {
    return (
      <div className="home-stay">
        <header className="home-stay-header">
          <div className="home-stay-divider">
            <CircleIcon>
              <Pyramid />
            </CircleIcon>
            <SmallOrb />
            <div className="divider" />
            <div className="small-divider" />
          </div>
        </header>

        <div className="home-stay-flex">
          <div className="home-stay-left">
            <header className="home-stay-header">
              <h2>
                Stay up to date with
                <br />
                <strong>Skynet updates</strong>
              </h2>
            </header>
            <Mailing id="mailing-top" />
          </div>

          <ul className="home-stay-right">
            <li>
              <SocialLink
                icon="github"
                url="https://github.com/NebulousLabs/skynet-webportal"
                greenText="View project on Github"
                title={<strong>/Skynet-Webportal</strong>}
              />
            </li>
            <li>
              <SocialLink
                icon="discord"
                url="https://discord.gg/sia"
                greenText="View project on Discord"
                title={<strong>/Sia</strong>}
              />
            </li>
            <li>
              <SocialLink
                icon="twitter"
                url="https://twitter.com/SiaTechHQ"
                greenText="View project on Twitter"
                title={<strong>@SiaTechHQ</strong>}
              />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
