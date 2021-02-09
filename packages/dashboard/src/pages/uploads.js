import dayjs from "dayjs";
import prettyBytes from "pretty-bytes";
import { useState } from "react";
import useSWR from "swr";
import Layout from "../components/Layout";
import Table from "../components/Table";

const apiPrefix = process.env.NODE_ENV === "development" ? "/api/stubs" : "";
const fetcher = (url) => fetch(url).then((r) => r.json());
const headers = [
  { key: "name", name: "Name" },
  { key: "skylink", name: "Skylink" },
  { key: "size", name: "Size", formatter: prettyBytes },
  { key: "uploadedOn", name: "Uploaded on", formatter: (date) => dayjs(date).format("YYYY-MM-DD HH:mm:ss") },
];
const actions = [];

export default function Uploads() {
  const [offset, setOffset] = useState(0);
  const { data, error } = useSWR(`${apiPrefix}/user/uploads?pageSize=10&offset=${offset}`, fetcher);

  return (
    <Layout title="Your uploads">
      <Table {...data} headers={headers} actions={actions} setOffset={setOffset} />
    </Layout>
  );
}
