import React from "react";

import { FooterOrb, FooterCube, Built } from "../../svg";
import "./Footer.scss";
import { Mailing } from "..";

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="width">
        <div className="footer-column">
          <Built width={120} height={120} preserveAspectRatio={"xMinYMin"} />
        </div>

        <div className="footer-column">
          <h2>Skynet Webportals</h2>

          <ul>
            <li>
              <a href="https://skydrain.net" target="_blank" rel="noopener noreferrer">
                skydrain.net
              </a>
            </li>
            <li>
              <a href="https://skyportal.xyz" target="_blank" rel="noopener noreferrer">
                skyportal.xyz
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h2>For Developers</h2>

          <ul>
            <li>
              <a href="https://blog.sia.tech/skynet-bdf0209d6d34" target="_blank" rel="noopener noreferrer">
                Skynet Overview
              </a>
            </li>
            <li>
              <a href="https://siasky.net/docs" target="_blank" rel="noopener noreferrer">
                API Docs
              </a>
            </li>
            <li>
              <a
                href="https://github.com/NebulousLabs/skynet-webportal/blob/master/setup-scripts/README.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                Portal Setup
              </a>
            </li>
            <li>
              <a
                href="https://support.siasky.net/key-concepts/skynet-portals/using-a-sia-node-as-a-portal"
                target="_blank"
                rel="noopener noreferrer"
              >
                Accessing Skynet Locally
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
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
        </div>

        <div className="footer-column">
          <h2>Links</h2>

          <ul>
            <li>
              <a href="https://sia.tech/" target="_blank" rel="noopener noreferrer">
                Sia.tech
              </a>
            </li>
            <li>
              <a href="https://jobs.lever.co/SkynetLabs" target="_blank" rel="noopener noreferrer">
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
        </div>

        <div className="footer-column">
          <h2>Stay up to date with Skynet updates</h2>
          <Mailing id="mailing-bottom" light />
        </div>
      </div>

      <FooterCube className="footer-cube" />
      <FooterOrb className="footer-orb" />
    </footer>
  );
}
