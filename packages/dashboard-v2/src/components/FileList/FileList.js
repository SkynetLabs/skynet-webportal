import * as React from "react";
import useSWR from "swr";
import { useMedia } from "react-use";

import theme from "../../lib/theme";

import { ContainerLoadingIndicator } from "../LoadingIndicator";
import { Select, SelectOption } from "../Select";
import { Switch } from "../Switch";
import { TextInputIcon } from "../TextInputIcon/TextInputIcon";
import { SearchIcon } from "../Icons";

import FileTable from "./FileTable";
import useFormattedFilesData from "./useFormattedFilesData";

const FileList = ({ type }) => {
  const isMediumScreenOrLarger = useMedia(`(min-width: ${theme.screens.md})`);
  const { data, error } = useSWR(`user/${type}?pageSize=10`);
  const items = useFormattedFilesData(data?.items || []);

  const setFilter = (name, value) => console.log("filter", name, "set to", value);

  if (!items.length) {
    return (
      <div className="flex w-full h-full justify-center items-center text-palette-400">
        {/* TODO: proper error message */}
        {!data && !error && <ContainerLoadingIndicator />}
        {!data && error && <p>An error occurred while loading this data.</p>}
        {data && <p>No {type} found.</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex flex-col gap-4 lg:flex-row justify-between items-center">
        <TextInputIcon
          className="w-full lg:w-[280px] xl:w-[420px]"
          placeholder="Search"
          icon={<SearchIcon size={20} />}
          onChange={console.log.bind(console)}
        />
        <div className="flex flex-row items-center uppercase font-light text-sm gap-4">
          <Switch onChange={(value) => setFilter("showSmallFiles", value)} className="mr-8">
            <span className="underline decoration-dashed underline-offset-2 decoration-2 decoration-gray-300">
              Show small files
            </span>
          </Switch>
          <div>
            <span className="pr-2">File type:</span>
            <Select onChange={(value) => setFilter("type", value)}>
              <SelectOption value="all" label="All" />
              <SelectOption value="mp4" label=".mp4" />
              <SelectOption value="pdf" label=".pdf" />
            </Select>
          </div>
          <div>
            <span className="pr-2">Sort:</span>
            <Select onChange={(value) => setFilter("type", value)}>
              <SelectOption value="size-desc" label="Biggest size" />
              <SelectOption value="size-asc" label="Smallest size" />
              <SelectOption value="date-desc" label="Latest" />
              <SelectOption value="date-asc" label="Oldest" />
            </Select>
          </div>
        </div>
      </div>
      {/* TODO: mobile view (it's not tabular) */}
      {isMediumScreenOrLarger ? <FileTable items={items} /> : "Mobile view"}
    </div>
  );
};

export default FileList;
