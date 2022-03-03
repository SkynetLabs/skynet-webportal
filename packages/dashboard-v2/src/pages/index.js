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
import Uploader from "../components/Uploader/Uploader";

const IndexPage = () => {
  const showRecentActivity = useMedia(`(min-width: ${theme.screens.md})`);

  return (
    <>
      <div className="w-full">
        <Slider
          slides={[
            <Panel title="Upload" className="h-[330px]">
              <Tabs variant="fill">
                <Tab id="files" title="Files" />
                <Tab id="directory" title="Directory" />
                <TabPanel tabId="files" className="h-full overflow-y-auto">
                  <Uploader mode="file" />
                </TabPanel>
                <TabPanel tabId="directory" className="h-full overflow-y-auto">
                  <Uploader mode="directory" />
                </TabPanel>
              </Tabs>
            </Panel>,
            <Panel
              title={
                <>
                  <ArrowRightIcon /> Usage
                </>
              }
              className="h-[330px]"
            >
              <CurrentUsage />
            </Panel>,
            <Panel
              title={
                <>
                  <ArrowRightIcon /> Current plan
                </>
              }
              className="h-[330px]"
            >
              <ul>
                <li>Current</li>
                <li>Plan</li>
                <li>Info</li>
              </ul>
            </Panel>,
          ]}
        />
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
