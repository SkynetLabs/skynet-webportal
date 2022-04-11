import * as React from "react";

import { Panel } from "../Panel";
import { Tab, TabPanel, Tabs } from "../Tabs";

import ActivityTable from "./ActivityTable";

export default function LatestActivity() {
  return (
    <Panel title="Latest activity">
      <Tabs>
        <Tab id="uploads" title="Uploads" />
        <Tab id="downloads" title="Downloads" />
        <TabPanel tabId="uploads" className="pt-4">
          <ActivityTable type="uploads" />
        </TabPanel>
        <TabPanel tabId="downloads" className="pt-4">
          <ActivityTable type="downloads" />
        </TabPanel>
      </Tabs>
    </Panel>
  );
}
