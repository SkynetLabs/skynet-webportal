import * as React from "react";
import { useMedia } from "react-use";

import theme from "../lib/theme";
import { PlansProvider } from "../contexts/plans/PlansProvider";
import { ArrowRightIcon } from "../components/Icons";
import { Panel } from "../components/Panel";
import { Tab, TabPanel, Tabs } from "../components/Tabs";
import LatestActivity from "../components/LatestActivity/LatestActivity";
import DashboardLayout from "../layouts/DashboardLayout";
import Slider from "../components/Slider/Slider";
import CurrentUsage from "../components/CurrentUsage";
import Uploader from "../components/Uploader/Uploader";
import CurrentPlan from "../components/CurrentPlan";
import { FullScreenLoadingIndicator } from "../components/LoadingIndicator";
import { Metadata } from "../components/Metadata";
import useUpgradeRedirect from "../hooks/useUpgradeRedirect";

const IndexPage = () => {
  const showRecentActivity = useMedia(`(min-width: ${theme.screens.md})`);
  const { verifyingSubscription } = useUpgradeRedirect();

  if (verifyingSubscription) {
    return <FullScreenLoadingIndicator />;
  }

  return (
    <>
      <Metadata>
        <title>Dashboard</title>
      </Metadata>
      {verifyingSubscription ? (
        <FullScreenLoadingIndicator />
      ) : (
        <PlansProvider>
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
                  <CurrentPlan />
                </Panel>,
              ]}
            />
          </div>
          {showRecentActivity && (
            <div className="mt-10">
              <LatestActivity />
            </div>
          )}
        </PlansProvider>
      )}
    </>
  );
};

IndexPage.Layout = DashboardLayout;

export default IndexPage;
