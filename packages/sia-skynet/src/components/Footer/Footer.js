import React from "react";
import Fade from "react-reveal/Fade";
import Reveal from "react-reveal/Reveal";

import { FooterOrb, FooterCube, Built } from "../../svg";
import "./Footer.scss";
import { Mailing } from "..";

export default function Footer() {
  return (
    <Reveal effect="active">
      <footer className="footer">
        <div className="width">
          <Fade duration={700} distance="40px" bottom>
            <div className="footer-column">
              <Built width={120} height={120} preserveAspectRatio={'xMinYMin'}/>
            </div>
          </Fade>

          <div className="footer-column">
            <Fade duration={700} distance="40px" bottom>
              <h2>Skynet Webportals</h2>

              <ul>
                <li>
                  <a href="https://skydrain.net" target="_blank" rel="noopener noreferrer">
                    skydrain.net
                  </a>
                </li>
                <li>
                  <a href="https://skynet.luxor.tech/" target="_blank" rel="noopener noreferrer">
                    skynet.luxor.tech
                  </a>
                </li>
                <li>
                  <a href="https://sialoop.net" target="_blank" rel="noopener noreferrer">
                    sialoop.net
                  </a>
                </li>
                <li>
                  <a href="https://skynet.tutemwesi.com" target="_blank" rel="noopener noreferrer">
                    skynet.tutemwesi.com
                  </a>
                </li>
                <li>
                  <a href="https://siacdn.com" target="_blank" rel="noopener noreferrer">
                    siacdn.com
                  </a>
                </li>
                <li>
                  <a href="https://vault.lightspeedhosting.com" target="_blank" rel="noopener noreferrer">
                    vault.lightspeedhosting.com
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
                  <a href="https://twitter.com/siatechhq" target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="https://discord.gg/sia" target="_blank" rel="noopener noreferrer">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="https://www.reddit.com/r/siacoin" target="_blank" rel="noopener noreferrer">
                    Reddit
                  </a>
                </li>
                <li>
                  <a href="https://blog.sia.tech" target="_blank" rel="noopener noreferrer">
                    Blog
                  </a>
                </li>
              </ul>
            </Fade>
          </div>

          <div className="footer-column">
            <Fade duration={700} distance="40px" bottom>
              <h2>Sia</h2>

              <ul>
                <li>
                  <a href="https://sia.tech/" target="_blank" rel="noopener noreferrer">
                    Sia.tech
                  </a>
                </li>
                <li>
                  <a href="https://jobs.lever.co/nebulous" target="_blank" rel="noopener noreferrer">
                    Jobs
                  </a>
                </li>
                <li>
                  <a href="https://support.siasky.net" target="_blank" rel="noopener noreferrer">
                    Support
                  </a>
                </li>
                <li>
                  <a href="terms.pdf" target="_blank" rel="noopener noreferrer">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="privacy.pdf" target="_blank" rel="noopener noreferrer">
                    Privacy
                  </a>
                </li>
              </ul>
            </Fade>
          </div>

          <div className="footer-column">
            <Fade duration={700} distance="40px" bottom>
              <h2>Stay up to date with Skynet updates</h2>
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
