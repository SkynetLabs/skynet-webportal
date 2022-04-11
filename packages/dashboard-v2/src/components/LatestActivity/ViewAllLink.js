import { Link } from "gatsby";

import { ArrowRightIcon } from "../Icons";

export const ViewAllLink = (props) => (
  <Link className="inline-flex mt-6 items-center gap-3 ease-in-out hover:brightness-90" {...props}>
    <span className="bg-primary rounded-full w-[32px] h-[32px] inline-flex justify-center items-center">
      <ArrowRightIcon />
    </span>
    <span className="font-sans text-xs uppercase text-palette-400">View all</span>
  </Link>
);
