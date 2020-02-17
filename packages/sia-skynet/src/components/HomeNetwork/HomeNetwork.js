import React, { Component } from "react";
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";
import Fade from "react-reveal/Fade";

import "./HomeNetwork.scss";
import { CircleIcon, FAQ } from "../";
import { SmallOrb, LogoSolid, Arrow, Deco6, Deco7, Deco8 } from "../../svg";

const stats = [
  { name: "TB Used", value: 664 },
  { name: "TB Capacity", value: 2315 },
  { name: "Hosts", value: 335 },
  { name: "Storage/TB", value: 91, cent: true },
  { name: "Bandwidth/TB", value: 18, cent: true }
];

export default class HomeNetwork extends Component {
  state = {
    visable: false
  };

  onChange = isVisible => {
    if (isVisible && !this.state.visable) {
      this.setState({ visable: true });
    }
  };

  render() {
    return (
      <div className="home-network">
        <header className="home-network-header">
          <Fade duration={700} distance="40px" bottom>
            <div className="home-network-divider">
              <CircleIcon>
                <LogoSolid />
              </CircleIcon>
              <SmallOrb />
              <div className="divider"></div>
              <div className="small-divider"></div>
            </div>
          </Fade>
          <Fade duration={700} distance="40px" bottom>
            <h2>
              Sia
              <br />
              <strong>Network</strong>
            </h2>
          </Fade>
        </header>

        <Fade duration={700} distance="40px" bottom>
          <VisibilitySensor
            onChange={this.onChange}
            partialVisibility
            offset={{ bottom: 100 }}
            scrollThrottle={50}
          >
            <div className="home-network-stats">
              {stats.map((stat, i) => (
                <React.Fragment key={i}>
                  <div key={i} className="home-network-stat">
                    <div className="inner">
                      <h3>
                        {this.state.visable ? (
                          <CountUp end={stat.value} duration={3.2} />
                        ) : (
                          0
                        )}
                        {stat.cent && "¢"}
                      </h3>
                      <span className="network-stat-name">{stat.name}</span>
                    </div>
                  </div>
                  {i !== 4 && <div className="divider" />}
                </React.Fragment>
              ))}
              <Deco6 className="deco-6" />
              <Deco7 className="deco-7" />
              <Deco8 className="deco-8" />
            </div>
          </VisibilitySensor>
        </Fade>

        <div className="home-network-columns">
          <div className="home-network-column left">
            <Fade duration={700} distance="40px" bottom>
              <p>
                Skynet Webportal is a low cost server that sits between Skynet
                and everyday users, enabling them to access Skynet content
                without needing to operate any special software. Once the
                Skylinks are generated, they can be shared with anyone to fetch
                data from Skynet. The original uploader does not need to stay
                online in order for the file to remain available. The Sia
                network handles all of the pinning, guaranteeing both high
                speeds and excellent uptime. A typical Skynet download starts in
                under 500 milliseconds and can stream at rates as high as 1
                gigabit per second. The Sia network serves as the backend
                storage layer for Skynet.
              </p>
            </Fade>

            <Fade duration={700} distance="40px" bottom>
              <p>
                Sia is the leading decentralized cloud storage platform. No
                signups, no servers, no trusted third parties. Sia leverages
                blockchain technology to create a data storage marketplace that
                is more robust and more affordable than traditional cloud
                storage providers. Storage costs are as much as 10x lower than
                traditional infrastructure, bandwidth costs as much as 100x
                lower, all without sacrificing performance or reliability.
              </p>

              <p>
                <a className="more" href="https://sia.tech/">
                  Learn more about Sia <Arrow />
                </a>
              </p>
            </Fade>
          </div>
          <div className="home-network-column">
            <Fade duration={700} distance="40px" bottom>
              <FAQ title="How do I use Skynet?">
                <p>
                  Anyone can access files that have been uploaded to Sia as long as they possess the corresponding skylink. You can use one of the webportals to download the files. <a href="https://skynet.helpdocs.io/article/3p9z5g9s0e-skynet-how-to" target="_blank" rel="noopener noreferrer" className="more read-mode">read more</a>
                </p>
              </FAQ>
            </Fade>

            <Fade duration={700} distance="40px" bottom>
              <FAQ title="How do I integrate Skynet into applications?">
                <p>
                  Applications can be deployed in under a minute and be immediately available globally. Skynet has an API as well as SDKs which integrate seamlessly with existing applications. <a href="https://skynet.helpdocs.io/article/hrshqsn9wz-integrating-skynet" target="_blank" rel="noopener noreferrer" className="more read-mode">read more</a>
                </p>
              </FAQ>
            </Fade>

            <Fade duration={700} distance="40px" bottom>
              <FAQ title="How fast is Skynet?">
                <p>
                  Skynet has speeds that surpass any current decentralized tech. A typical throughput for larger downloads is around 1 gigabit per second. <a href="https://skynet.helpdocs.io/article/430teoxgqc-skynet-speed" target="_blank" rel="noopener noreferrer" className="more read-mode">read more</a>
                </p>
              </FAQ>
            </Fade>

            <Fade duration={700} distance="40px" bottom>
              <FAQ title="How expensive is using Skynet?">
                <p>
                  Storage costs are as much as 10x lower than traditional infrastructure, bandwidth costs as much as 100x lower, all without sacrificing performance or reliability. <a href="https://skynet.helpdocs.io/article/hrshqsn9wz-integrating-skynet" target="_blank" rel="noopener noreferrer" className="more read-mode">read more</a>
                </p>
              </FAQ>
            </Fade>

            <Fade duration={700} distance="40px" bottom>
              <a className="more more-faq" href="https://support.sia.tech/">
                View more FAQ
              </a>
            </Fade>
          </div>
        </div>
      </div>
    );
  }
}
