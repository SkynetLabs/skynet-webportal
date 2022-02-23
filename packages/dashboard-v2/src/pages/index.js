import * as React from "react";
import { useMedia } from "react-use";

import theme from "../lib/theme";
import { ArrowRightIcon } from "../components/Icons";
import { Panel } from "../components/Panel";
import { Tab, TabPanel, Tabs } from "../components/Tabs";
import LatestActivity from "../components/LatestActivity/LatestActivity";
import DashboardLayout from "../layouts/DashboardLayout";
import Slider from "../components/Slider/Slider";
import CurrentUsage from "../components/CurrentUsage";

const IndexPage = () => {
  const showRecentActivity = useMedia(`(min-width: ${theme.screens.md})`);

  return (
    <>
      <div className="w-full">
        <Slider
          slides={[
            <Panel title="Upload">
              <Tabs variant="fill">
                <Tab id="files" title="Files" />
                <Tab id="directory" title="Directory" />
                <TabPanel tabId="files">
                  <div className="w-full py-16 bg-palette-100/50 text-center">Upload files...</div>
                </TabPanel>
                <TabPanel tabId="directory">
                  <div className="w-full py-16 bg-palette-100/50 text-center">Upload a directory...</div>
                </TabPanel>
              </Tabs>
            </Panel>,
            <Panel
              title={
                <>
                  <ArrowRightIcon /> Usage
                </>
              }
            >
              <CurrentUsage />
            </Panel>,
            <Panel
              title={
                <>
                  <ArrowRightIcon /> Current plan
                </>
              }
            >
              <ul>
                <li>Current</li>
                <li>Plan</li>
                <li>Info</li>
              </ul>
            </Panel>,
          ]}
        ></Slider>
      </div>
      {showRecentActivity && (
        <div className="mt-10">
          <LatestActivity />
        </div>
      )}
    </>
  );
};

IndexPage.Layout = DashboardLayout;

export default IndexPage;
