import { useState } from "react";

import UserSettingsLayout from "../../layouts/UserSettingsLayout";

import { Switch } from "../../components/Switch";
import { Button } from "../../components/Button";
import { Metadata } from "../../components/Metadata";

import exportImg from "../../../static/images/import-export.svg";

const useExportOptions = () => {
  const [pinnedFiles, setPinnedFiles] = useState(false);
  const [uploadHistory, setUploadHistory] = useState(false);
  const [downloadHistory, setDownloadHistory] = useState(false);

  const selectedOptions = {
    pinnedFiles,
    uploadHistory,
    downloadHistory,
  };

  return {
    selectedOptions: Object.keys(selectedOptions).filter((o) => selectedOptions[o]),
    setPinnedFiles,
    setUploadHistory,
    setDownloadHistory,
  };
};

const ExportPage = () => {
  const { selectedOptions, setPinnedFiles, setUploadHistory, setDownloadHistory } = useExportOptions();

  return (
    <>
      <Metadata>
        <title>Export</title>
      </Metadata>
      <div className="flex flex-col xl:flex-row">
        <div className="flex flex-col gap-10 lg:shrink-0 lg:max-w-[576px] xl:max-w-[524px]">
          <section>
            <h4>Export</h4>
            <p>
              Select the items you want to export. You can use this data to migrate your account to another Skynet
              portal.
            </p>
          </section>
          <hr />
          <section className="flex flex-col gap-8">
            <ul className="flex flex-col gap-2">
              <li>
                <Switch onChange={setUploadHistory}>Upload history</Switch>
              </li>
              <li>
                <Switch onChange={setDownloadHistory}>Download history</Switch>
              </li>
              <li>
                <Switch onChange={setPinnedFiles}>Pinned files</Switch>
              </li>
            </ul>
            <Button
              $primary
              disabled={selectedOptions.length === 0}
              onClick={() => console.log("TODO: actually export:", selectedOptions)}
            >
              Export
            </Button>
          </section>
        </div>
        <div className="hidden xl:block w-full text-right pt-20 pr-6">
          <img src={exportImg} alt="" className="inline-block w-[200px]" />
        </div>
      </div>
    </>
  );
};

ExportPage.Layout = UserSettingsLayout;

export default ExportPage;
