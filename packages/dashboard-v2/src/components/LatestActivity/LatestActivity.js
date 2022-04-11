import * as React from "react";
import { Link } from "gatsby";

import { Panel } from "../Panel";
import { Tab, TabPanel, Tabs } from "../Tabs";
import { ArrowRightIcon } from "../Icons";

import ActivityTable from "./ActivityTable";

const ViewAllLink = (props) => (
  <Link className="inline-flex mt-6 items-center gap-3 ease-in-out hover:brightness-90" {...props}>
    <span className="bg-primary rounded-full w-[32px] h-[32px] inline-flex justify-center items-center">
      <ArrowRightIcon />
    </span>
    <span className="font-sans text-xs uppercase text-palette-400">View all</span>
  </Link>
);

export default function LatestActivity() {
  return (
    <Panel title="Latest activity">
      <Tabs>
        <Tab id="uploads" title="Uploads" />
        <Tab id="downloads" title="Downloads" />
        <TabPanel tabId="uploads" className="pt-4">
          <ActivityTable type="uploads" />
          <ViewAllLink to="/files?tab=uploads" />
        </TabPanel>
        <TabPanel tabId="downloads" className="pt-4">
          <ActivityTable type="downloads" />
          <ViewAllLink to="/files?tab=downloads" />
        </TabPanel>
      </Tabs>
    </Panel>
  );
}
