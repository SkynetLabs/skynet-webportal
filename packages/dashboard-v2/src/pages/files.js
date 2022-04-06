import * as React from "react";
import { useSearchParam } from "react-use";

import DashboardLayout from "../layouts/DashboardLayout";

import { Panel } from "../components/Panel";
import { Tab, TabPanel, Tabs } from "../components/Tabs";
import { Metadata } from "../components/Metadata";
import FileList from "../components/FileList/FileList";

const FilesPage = () => {
  const defaultTab = useSearchParam("tab");

  return (
    <>
      <Metadata>
        <title>My Files</title>
      </Metadata>
      <Panel title="Files">
        <Tabs defaultTab={defaultTab || "uploads"}>
          <Tab id="uploads" title="Uploads" />
          <Tab id="downloads" title="Downloads" />
          <TabPanel tabId="uploads" className="pt-4">
            <FileList type="uploads" />
          </TabPanel>
          <TabPanel tabId="downloads" className="pt-4">
            <FileList type="downloads" />
          </TabPanel>
        </Tabs>
      </Panel>
    </>
  );
};

FilesPage.Layout = DashboardLayout;

export default FilesPage;
