import React, { Component } from 'react'
import Fade from 'react-reveal/Fade'

import './HomeStay.scss'
import { SocialLink, CircleIcon, Mailing } from '../'
import { SmallOrb, Pyramid } from '../../svg'

export default class HomeStay extends Component {
  render() {
    return (
      <div className="home-stay">
        <header className="home-stay-header">
          <Fade distance="40px" bottom>
            <div className="home-stay-divider">
              <CircleIcon>
                <Pyramid />
              </CircleIcon>
              <SmallOrb />
              <div className="divider" />
              <div className="small-divider" />
            </div>
          </Fade>
          <Fade distance="40px" bottom>
            <h2>
              Stay up to date with
              <br />
              <strong>Skynet updates</strong>
            </h2>
          </Fade>
        </header>

        <div className="home-stay-flex">
          <div className="home-stay-left">
            <Fade distance="40px" bottom>
              <p>
                Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras justo odio, dapibus ac
                facilisis in.
              </p>
            </Fade>

            <Fade distance="40px" bottom>
              <Mailing id="check1" />
            </Fade>

            <Fade distance="40px" bottom>
              <p className="disclaimer-text">
                Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras justo odio, dapibus ac
                facilisis in.
              </p>
            </Fade>
          </div>

          <ul className="home-stay-right">
            <Fade distance="40px" bottom>
              <li>
                <SocialLink
                  icon="github"
                  url="https://github.com/NebulousLabs/skynet-webportal"
                  greenText="View project on Github"
                  title={
                    <>
                      NebulousLabs/<strong>Skynet-Webportal</strong>
                    </>
                  }
                />
              </li>
            </Fade>
            <Fade distance="40px" bottom>
              <li>
                <SocialLink
                  icon="discord"
                  url="https://discord.gg/sia"
                  greenText="View project on Github"
                  title={<strong>/Sia</strong>}
                />
              </li>
            </Fade>
            <Fade distance="40px" bottom>
              <li>
                <SocialLink
                  icon="twitter"
                  url="https://twitter.com/SiaTechHQ?s=20"
                  greenText="View project on Github"
                  title={<strong>@SiaTechHQ</strong>}
                />
              </li>
            </Fade>
          </ul>
        </div>
      </div>
    )
  }
}
