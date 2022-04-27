import { useState } from "react";
import cn from "classnames";

import { ChevronDownIcon } from "../Icons";
import { useSkylinkSharing } from "./useSkylinkSharing";
import { ContainerLoadingIndicator } from "../LoadingIndicator";
import { useSkylinkOptions } from "./useSkylinkOptions";

const SharingMenu = ({ skylink }) => {
  const { options } = useSkylinkSharing(skylink);

  return (
    <div className="flex flex-col gap-4 bg-white px-4 py-6 w-1/2">
      {options.map(({ label, callback }, index) => (
        <button key={index} className="uppercase text-left" onClick={callback}>
          {label}
        </button>
      ))}
    </div>
  );
};

const OptionsMenu = ({ skylink, onUpdated }) => {
  const { inProgress, options } = useSkylinkOptions({ skylink, onUpdated });

  return (
    <div className={cn("relative px-4 py-6 w-1/2", { "bg-primary/10": !inProgress })}>
      <div className={cn("flex flex-col gap-4", { "opacity-0": inProgress })}>
        {options.map(({ label, callback }, index) => (
          <button key={index} className="uppercase text-left" onClick={callback}>
            {label}
          </button>
        ))}
      </div>
      {inProgress && (
        <ContainerLoadingIndicator className="absolute inset-0 !p-0 z-50 bg-primary/10 !text-palette-200" />
      )}
    </div>
  );
};

const ListItem = ({ item, onUpdated }) => {
  const { name, type, size, date, skylink } = item;
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((open) => !open);

  return (
    <div className={cn("p-4 flex flex-col bg-palette-100", { "bg-opacity-50": !open })}>
      <div className="flex items-center gap-4 justify-between">
        <div className="info flex flex-col gap-2 truncate">
          <div className="truncate">{name}</div>
          <div className="flex divide-x divide-palette-200 text-xs">
            <span className="px-1">{type}</span>
            <span className="px-1">{size}</span>
            <span className="px-1">{date}</span>
          </div>
        </div>
        <button onClick={toggle}>
          <ChevronDownIcon className={cn("transition-[transform]", { "-scale-100": open })} />
        </button>
      </div>
      <div
        className={cn(
          "flex transition-[max-height_padding] overflow-hidden text-xs text-left font-sans tracking-normal",
          { "pt-4 max-h-[150px]": open, "pt-0 max-h-0": !open }
        )}
      >
        <SharingMenu skylink={skylink} />
        <OptionsMenu skylink={skylink} onUpdated={onUpdated} />
      </div>
    </div>
  );
};

export const MobileFileList = ({ items, onUpdated }) => {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <ListItem key={item.id} item={item} onUpdated={onUpdated} />
      ))}
    </div>
  );
};
