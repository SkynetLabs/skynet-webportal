import { useMemo } from "react";
import prettyBytes from "pretty-bytes";
import dayjs from "dayjs";
import { DATE_FORMAT } from "../../lib/config";

const parseFileName = (fileName) => {
  const lastDotIndex = Math.max(0, fileName.lastIndexOf(".")) || Infinity;

  return [fileName.substr(0, lastDotIndex), fileName.substr(lastDotIndex)];
};

const formatItem = ({ size, name: rawFileName, uploadedOn, downloadedOn, ...rest }) => {
  const [name, type] = parseFileName(rawFileName);
  const date = dayjs(uploadedOn || downloadedOn).format(DATE_FORMAT);

  return {
    ...rest,
    date,
    size: prettyBytes(size),
    type,
    name,
  };
};

const useFormattedFilesData = (items) => useMemo(() => items.map(formatItem), [items]);

export default useFormattedFilesData;
