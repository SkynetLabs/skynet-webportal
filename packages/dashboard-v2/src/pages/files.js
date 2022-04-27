import * as React from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import { Panel } from "../components/Panel";
import { Metadata } from "../components/Metadata";
import FileList from "../components/FileList/FileList";

const FilesPage = () => {
  return (
    <>
      <Metadata>
        <title>Files</title>
      </Metadata>
      <Panel title="Uploads">
        <FileList type="uploads" />
      </Panel>
    </>
  );
};

FilesPage.Layout = DashboardLayout;

export default FilesPage;
