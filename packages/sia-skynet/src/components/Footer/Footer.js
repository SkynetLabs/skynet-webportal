import React from "react";
import Fade from "react-reveal/Fade";
import Reveal from "react-reveal/Reveal";

import { Arrow, FooterOrb, FooterCube, Built } from "../../svg";
import "./Footer.scss";
import { Mailing } from "..";

export default function Footer() {
  return (
    <Reveal effect="active">
      <footer className="footer">
        <div className="width">
          <Fade duration={700} distance="40px" bottom>
            <div className="footer-column">
              <Built />
            </div>
          </Fade>

          <div className="footer-column">
            <Fade duration={700} distance="40px" bottom>
              <h2>Sia Elsewhere</h2>

              <ul>
                <li>
                  <a href="https://angel.co/company/nebulous/jobs" target="_blank" rel="noopener noreferrer">
                    Sia Jobs <Arrow />
                  </a>
                </li>
                <li>
                  <a href="https://skynet.luxor.tech" target="_blank" rel="noopener noreferrer">
                    Luxor Tech
                    <Arrow />
                  </a>
                </li>
                <li>
                  <a href="https://sialoop.net" target="_blank" rel="noopener noreferrer">
                    Sia Loop <Arrow />
                  </a>
                </li>
                <li>
                  <a href="https://skynet.tutemwesi.com" target="_blank" rel="noopener noreferrer">
                    Tutem Wesi <Arrow />
                  </a>
                </li>
              </ul>
            </Fade>
          </div>

          <div className="footer-column">
            <Fade duration={700} distance="40px" bottom>
              <h2>Social</h2>
              <ul>
                <li>
                  <a href="https://www.reddit.com/r/siacoin/" target="_blank" rel="noopener noreferrer">
                    Reddit
                    <Arrow />
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/siatechhq" target="_blank" rel="noopener noreferrer">
                    Twitter <Arrow />
                  </a>
                </li>
                <li>
                  <a href="https://discord.gg/sia" target="_blank" rel="noopener noreferrer">
                    Discord <Arrow />
                  </a>
                </li>
                <li>
                  <a href="https://github.com/NebulousLabs" target="_blank" rel="noopener noreferrer">
                    Github <Arrow />
                  </a>
                </li>
              </ul>
            </Fade>
          </div>

          <div className="footer-column">
            <Fade duration={700} distance="40px" bottom>
              <h2>Stay up-to-date with Skynet updates</h2>
              <Mailing id="check2" light />
            </Fade>
          </div>
        </div>

        <FooterCube className="footer-cube fadeInUp delay2" />
        <FooterOrb className="footer-orb fadeInUp delay2" />
      </footer>
    </Reveal>
  );
}
