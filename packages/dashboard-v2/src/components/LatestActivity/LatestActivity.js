import * as React from "react";

import { Panel } from "../Panel";

import ActivityTable from "./ActivityTable";

export default function LatestActivity() {
  return (
    <Panel title="Latest uploads">
      <ActivityTable type="uploads" />
    </Panel>
  );
}
