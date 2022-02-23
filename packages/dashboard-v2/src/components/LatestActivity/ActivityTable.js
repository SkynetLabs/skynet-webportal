import * as React from "react";
import { Table, TableBody, TableCell, TableRow } from "../Table";

export default function ActivityTable({ data }) {
  return (
    <Table style={{ tableLayout: "fixed" }}>
      <TableBody>
        {data.map(({ name, type, size, uploaded, skylink }) => (
          <TableRow key={skylink}>
            <TableCell>{name}</TableCell>
            <TableCell width="80px">{type}</TableCell>
            <TableCell width="80px" align="right">
              {size}
            </TableCell>
            <TableCell width="180px">{uploaded}</TableCell>
            <TableCell>{skylink}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
