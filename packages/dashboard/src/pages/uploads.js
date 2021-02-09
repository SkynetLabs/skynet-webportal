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

export default function Downloads() {
  const [page, setPage] = useState(1);
  const { data, error } = useSWR(`${apiPrefix}/user/uploads`, fetcher);

  return (
    <Layout title="Your uploads">
      {data && <Table data={data} headers={headers} actions={actions} page={page} setPage={setPage} />}
    </Layout>
  );
}
