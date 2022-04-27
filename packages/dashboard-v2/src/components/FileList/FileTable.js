import { CogIcon, ShareIcon } from "../Icons";
import { PopoverMenu } from "../PopoverMenu/PopoverMenu";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "../Table";
import { CopyButton } from "../CopyButton";
import { useSkylinkOptions } from "./useSkylinkOptions";
import { useSkylinkSharing } from "./useSkylinkSharing";

const SkylinkOptionsMenu = ({ skylink, onUpdated }) => {
  const { inProgress, options } = useSkylinkOptions({ skylink, onUpdated });

  return (
    <PopoverMenu inProgress={inProgress} options={options} openClassName="text-primary">
      <button aria-label="Manage this skylink">
        <CogIcon />
      </button>
    </PopoverMenu>
  );
};

const SkylinkSharingMenu = ({ skylink }) => {
  const { options } = useSkylinkSharing(skylink);

  return (
    <PopoverMenu options={options} openClassName="text-primary">
      <button aria-label="Share this skylink">
        <ShareIcon size={22} />
      </button>
    </PopoverMenu>
  );
};

export default function FileTable({ items, onUpdated }) {
  return (
    <div className="flex flex-col gap-4">
      <Table style={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow noHoverEffect>
            <TableHeadCell className="w-[180px] xl:w-[360px]">Name</TableHeadCell>
            <TableHeadCell className="w-[80px]">Type</TableHeadCell>
            <TableHeadCell className="w-[100px]" align="right">
              Size
            </TableHeadCell>
            <TableHeadCell className="w-[160px]">Uploaded</TableHeadCell>
            <TableHeadCell className="hidden lg:table-cell">Skylink</TableHeadCell>
            <TableHeadCell className="w-[90px]">Activity</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => {
            const { id, name, type, size, date, skylink } = item;

            return (
              <TableRow key={id}>
                <TableCell className="w-[180px] xl:w-[360px]">{name}</TableCell>
                <TableCell className="w-[80px]">{type}</TableCell>
                <TableCell className="w-[100px]" align="right">
                  {size}
                </TableCell>
                <TableCell className="w-[160px]">{date}</TableCell>
                <TableCell className="hidden lg:table-cell pr-6 !overflow-visible">
                  <div className="flex items-center">
                    <CopyButton value={skylink} className="mr-2" aria-label="Copy skylink" />
                    <span className="w-full inline-block truncate">{skylink}</span>
                  </div>
                </TableCell>
                <TableCell className="w-[90px] !overflow-visible">
                  <div className="flex text-palette-600 gap-4">
                    <SkylinkOptionsMenu skylink={skylink} onUpdated={onUpdated} />
                    <SkylinkSharingMenu skylink={skylink} />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
