import { useState } from "react";
import useSWR from "swr";
import { useMedia } from "react-use";

import theme from "../../lib/theme";

import { ContainerLoadingIndicator } from "../LoadingIndicator";

import FileTable from "./FileTable";
import useFormattedFilesData from "./useFormattedFilesData";
import { MobileFileList } from "./MobileFileList";
import { Pagination } from "./Pagination";

const PAGE_SIZE = 10;

const FileList = ({ type }) => {
  const isMediumScreenOrLarger = useMedia(`(min-width: ${theme.screens.md})`);
  const [offset, setOffset] = useState(0);
  const baseUrl = `user/${type}?pageSize=${PAGE_SIZE}`;
  const {
    data,
    error,
    mutate: refreshList,
  } = useSWR(`${baseUrl}&offset=${offset}`, {
    revalidateOnMount: true,
  });
  const items = useFormattedFilesData(data?.items || []);
  const count = data?.count || 0;

  // Next page preloading
  const hasMoreRecords = data ? data.offset + data.pageSize < data.count : false;
  const nextPageOffset = hasMoreRecords ? data.offset + data.pageSize : offset;
  useSWR(`${baseUrl}&offset=${nextPageOffset}`);

  if (!items.length) {
    return (
      <div className="flex w-full h-full justify-center items-center text-palette-400">
        {!data && !error && <ContainerLoadingIndicator />}
        {!data && error && <p>An error occurred while loading this data.</p>}
        {data && <p>No {type} found.</p>}
      </div>
    );
  }

  return (
    <>
      {isMediumScreenOrLarger ? (
        <FileTable onUpdated={refreshList} items={items} />
      ) : (
        <MobileFileList items={items} onUpdated={refreshList} />
      )}
      <Pagination count={count} offset={offset} setOffset={setOffset} pageSize={PAGE_SIZE} />
    </>
  );
};

export default FileList;
