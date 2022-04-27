import { useMemo } from "react";
import dayjs from "dayjs";
import { DATE_FORMAT } from "../../lib/config";
import humanBytes from "../../lib/humanBytes";

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
    size: humanBytes(size, { precision: 2 }),
    type,
    name,
  };
};

const useFormattedFilesData = (items) => useMemo(() => items.map(formatItem), [items]);

export default useFormattedFilesData;
