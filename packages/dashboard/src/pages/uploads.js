import dayjs from "dayjs";
import prettyBytes from "pretty-bytes";
import { useState } from "react";
import useSWR from "swr";
import Layout from "../components/Layout";
import Table from "../components/Table";
import authServerSideProps from "../services/authServerSideProps";
import { SkynetClient } from "skynet-js";

const apiPrefix = process.env.NODE_ENV === "development" ? "/api/stubs" : "";
const fetcher = (url) => fetch(url).then((r) => r.json());

export const getServerSideProps = authServerSideProps(() => {
  const skynetClient = new SkynetClient(process.env.SKYNET_PORTAL_API);
  const getSkylinkLink = ({ skylink }) => skynetClient.getSkylinkUrl(skylink);
  const getRelativeDate = ({ uploadedOn }) => dayjs(uploadedOn).format("YYYY-MM-DD HH:mm:ss");
  const headers = [
    { key: "name", name: "Name", nowrap: false, href: getSkylinkLink },
    { key: "skylink", name: "Skylink" },
    { key: "size", name: "Size", formatter: ({ size }) => prettyBytes(size) },
    { key: "uploadedOn", name: "Uploaded on", formatter: getRelativeDate },
  ];
  const actions = [];

  return { props: { headers, actions } };
});

export default function Uploads({ headers, actions }) {
  const [offset, setOffset] = useState(0);
  const { data, error } = useSWR(`${apiPrefix}/user/uploads?pageSize=10&offset=${offset}`, fetcher);

  return (
    <Layout title="Your uploads">
      <Table {...data} headers={headers} actions={actions} setOffset={setOffset} />
    </Layout>
  );
}
