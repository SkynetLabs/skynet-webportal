import * as React from "react";
import { Panel } from "../Panel";
import { Tab, TabPanel, Tabs } from "../Tabs";
import ActivityTable from "./ActivityTable";
import useRecentActivityData from "./useActivityData";

export default function LatestActivity() {
  const { downloads, uploads } = useRecentActivityData();

  return (
    <Panel title="Latest activity">
      <Tabs>
        <Tab id="uploads" title="Uploads" />
        <Tab id="downloads" title="Downloads" />
        <TabPanel tabId="uploads" className="pt-4">
          <ActivityTable data={uploads} />
        </TabPanel>
        <TabPanel tabId="downloads" className="pt-4">
          <ActivityTable data={downloads} />
        </TabPanel>
      </Tabs>
    </Panel>
  );
}
