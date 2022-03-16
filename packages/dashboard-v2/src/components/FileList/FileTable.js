import { CogIcon, ShareIcon } from "../Icons";
import { PopoverMenu } from "../PopoverMenu/PopoverMenu";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "../Table";
import { CopyButton } from "../CopyButton";

const buildShareMenu = (item) => {
  return [
    {
      label: "Facebook",
      callback: () => {
        console.info("share to Facebook", item);
      },
    },
    {
      label: "Twitter",
      callback: () => {
        console.info("share to Twitter", item);
      },
    },
    {
      label: "Discord",
      callback: () => {
        console.info("share to Discord", item);
      },
    },
  ];
};

const buildOptionsMenu = (item) => {
  return [
    {
      label: "Preview",
      callback: () => {
        console.info("preview", item);
      },
    },
    {
      label: "Download",
      callback: () => {
        console.info("download", item);
      },
    },
    {
      label: "Unpin",
      callback: () => {
        console.info("unpin", item);
      },
    },
    {
      label: "Report",
      callback: () => {
        console.info("report", item);
      },
    },
  ];
};

export default function FileTable({ items }) {
  return (
    <Table style={{ tableLayout: "fixed" }}>
      <TableHead>
        <TableRow noHoverEffect>
          <TableHeadCell className="w-[240px] xl:w-[360px]">Name</TableHeadCell>
          <TableHeadCell className="w-[80px]">Type</TableHeadCell>
          <TableHeadCell className="w-[80px]" align="right">
            Size
          </TableHeadCell>
          <TableHeadCell className="w-[180px]">Uploaded</TableHeadCell>
          <TableHeadCell className="hidden lg:table-cell">Skylink</TableHeadCell>
          <TableHeadCell className="w-[100px]">Activity</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => {
          const { id, name, type, size, date, skylink } = item;

          return (
            <TableRow key={id}>
              <TableCell className="w-[240px] xl:w-[360px]">{name}</TableCell>
              <TableCell className="w-[80px]">{type}</TableCell>
              <TableCell className="w-[80px]" align="right">
                {size}
              </TableCell>
              <TableCell className="w-[180px]">{date}</TableCell>
              <TableCell className="hidden lg:table-cell pr-6 !overflow-visible">
                <div className="flex items-center">
                  <CopyButton value={skylink} className="mr-2" />
                  <span className="w-full inline-block truncate">{skylink}</span>
                </div>
              </TableCell>
              <TableCell className="w-[100px] !overflow-visible">
                <div className="flex text-palette-600 gap-4">
                  <PopoverMenu options={buildShareMenu(item)} openClassName="text-primary">
                    <button>
                      <ShareIcon size={22} />
                    </button>
                  </PopoverMenu>
                  <PopoverMenu options={buildOptionsMenu(item)} openClassName="text-primary">
                    <button>
                      <CogIcon />
                    </button>
                  </PopoverMenu>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
