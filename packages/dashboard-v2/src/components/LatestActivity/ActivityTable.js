import * as React from "react";
import useSWR from "swr";

import { Table, TableBody, TableCell, TableRow } from "../Table";
import { ContainerLoadingIndicator } from "../LoadingIndicator";

import useFormattedActivityData from "./useFormattedActivityData";

export default function ActivityTable({ type }) {
  const { data, error } = useSWR(`user/${type}?pageSize=3`);
  const items = useFormattedActivityData(data?.items || []);

  if (!items.length) {
    return (
      <div className="flex w-full h-full justify-center items-center text-palette-400">
        {/* TODO: proper error message */}
        {!data && !error && <ContainerLoadingIndicator />}
        {!data && error && <p>An error occurred while loading this data.</p>}
        {data && !error && <p>No files found.</p>}
      </div>
    );
  }

  return (
    <Table style={{ tableLayout: "fixed" }}>
      <TableBody>
        {items.map(({ id, name, type, size, date, skylink }) => (
          <TableRow key={id}>
            <TableCell>{name}</TableCell>
            <TableCell className="w-[80px]">{type}</TableCell>
            <TableCell className="w-[80px]" align="right">
              {size}
            </TableCell>
            <TableCell className="w-[180px]">{date}</TableCell>
            <TableCell>{skylink}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
