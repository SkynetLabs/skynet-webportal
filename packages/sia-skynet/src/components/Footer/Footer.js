import React from 'react'
import Fade from 'react-reveal/Fade'
import Reveal from 'react-reveal/Reveal'

import { Arrow, FooterOrb, FooterCube, Built } from '../../svg'
import './Footer.scss'
import { Mailing } from '..'

export default function Footer() {
  return (
    <Reveal effect="active">
      <footer className="footer">
        <div className="width">
          <Fade distance="40px" bottom>
            <div className="footer-column">
              <Built />
            </div>
          </Fade>

          <div className="footer-column">
            <Fade distance="40px" bottom>
              <h2>Sia Elsewhere</h2>

              <ul>
                <li>
                  <a href="#">
                    Sia Jobs <Arrow />
                  </a>
                </li>
                <li>
                  <a href="https://skynet.luxor.tech">
                    Luxor Tech
                    <Arrow />
                  </a>
                </li>
                <li>
                  <a href="https://sialoop.net">
                    Sia Loop <Arrow />
                  </a>
                </li>
                <li>
                  <a href="https://skynet.tutemwesi.com">
                    Tutem Wesi <Arrow />
                  </a>
                </li>
              </ul>
            </Fade>
          </div>

          <div className="footer-column">
            <Fade distance="40px" bottom>
              <h2>Social</h2>
              <ul>
                <li>
                  <a href="#">
                    Reddit
                    <Arrow />
                  </a>
                </li>
                <li>
                  <a href="#">
                    Twitter <Arrow />
                  </a>
                </li>
                <li>
                  <a href="#">
                    Discord <Arrow />
                  </a>
                </li>
                <li>
                  <a href="#">
                    Github <Arrow />
                  </a>
                </li>
              </ul>
            </Fade>
          </div>

          <div className="footer-column">
            <Fade distance="40px" bottom>
              <h2>Stay up-to-date with Skynet updates</h2>
              <Mailing id="check2" light />
            </Fade>
          </div>
        </div>

        <FooterCube className="footer-cube fadeInUp delay2" />
        <FooterOrb className="footer-orb fadeInUp delay2" />
      </footer>
    </Reveal>
  )
}
