import { CogIcon } from "../Icons";

import { IconButton } from "../IconButton";
import { Table, TableBody, TableHead, TableCell, TableRow, TableHeadCell } from "./";

export default {
  title: "SkynetLibrary/Table",
  component: Table,
  subcomponents: {
    TableBody,
    TableHead,
    TableCell,
    TableRow,
    TableHeadCell,
  },
};

const DATA = [
  {
    name: "At_vereo_eos_censes",
    type: ".mp4",
    size: "2.45 MB",
    uploaded: "a few seconds ago",
    skylink: "_HyFqH632Rmy99c93idTtBVXeRDgaDAAWg6Bmm5P1izriu",
  },
  {
    name: "Miriam Klein IV",
    type: ".pdf",
    size: "7.52 MB",
    uploaded: "01/04/2021; 17:11",
    skylink: "_izriuHyFqH632Rmy99c93idTtBVXeRDgaDAAWg6Bmm5P1",
  },
  {
    name: "tmp/QmWR6eVDVkwhAYq7X99w4xT9KNKBzwK39Fj1PDmr4ZnzMm/QmWR6eVDVkwhAYq7X99w4xT9KNKBzwK39Fj1PDmr4ZnzMm",
    type: ".doc",
    size: "8.15 MB",
    uploaded: "10/26/2020; 7:21",
    skylink: "_VXeRDgaDAAWg6Bmm5P1izriuHyFqH632Rmy99c93idTtB",
  },
  {
    name: "Perm_London",
    type: ".avi",
    size: "225.6 MB",
    uploaded: "09/12/2020; 19:28",
    skylink: "_eRDgaDAAWg6Bmm5P1izriuHyFqH632Rmy99c93idTtBVX",
  },
  {
    name: "Santa_Clara",
    type: ".pdf",
    size: "7.52 MB",
    uploaded: "09/12/2020; 19:23",
    skylink: "_AWg6Bmm5P1izriuHyFqH632Rmy99c93idTtBVXeRDgaDA",
  },
  {
    name: "Marysa_Labrone",
    type: ".doc",
    size: "8.15 MB",
    uploaded: "09/12/2020; 19:21",
    skylink: "_P1izriuHyFqH632Rmy99c93idTtBVXeRDgaDAAWg6Bmm5",
  },
];

const Template = (args) => (
  <Table {...args}>
    <TableHead>
      <TableRow noHoverEffect>
        <TableHeadCell>Name</TableHeadCell>
        <TableHeadCell>Type</TableHeadCell>
        <TableHeadCell align="right">Size</TableHeadCell>
        <TableHeadCell>Uploaded</TableHeadCell>
        <TableHeadCell>Skylink</TableHeadCell>
        <TableHeadCell>Activity</TableHeadCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {DATA.map(({ name, type, size, uploaded, skylink }) => (
        <TableRow key={skylink}>
          <TableCell maxWidth="200px">{name}</TableCell>
          <TableCell>{type}</TableCell>
          <TableCell align="right">{size}</TableCell>
          <TableCell>{uploaded}</TableCell>
          <TableCell>{skylink}</TableCell>
          <TableCell>
            <IconButton icon={<CogIcon width={24} color="#0d0d0d" />}></IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export const RegularTable = Template.bind({});
RegularTable.args = {};
