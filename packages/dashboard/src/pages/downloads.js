import dayjs from "dayjs";
import prettyBytes from "pretty-bytes";
import { useState } from "react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import authServerSideProps from "../services/authServerSideProps";
import { SkynetClient } from "skynet-js";
import useAccountsApi from "../services/useAccountsApi";

const skynetClient = new SkynetClient(process.env.NEXT_PUBLIC_SKYNET_PORTAL_API);
const apiPrefix = process.env.NODE_ENV === "development" ? "/api/stubs" : "";
const getSkylinkLink = ({ skylink }) => skynetClient.getSkylinkUrl(skylink);
const getRelativeDate = ({ downloadedOn }) => dayjs(downloadedOn).format("YYYY-MM-DD HH:mm:ss");
const headers = [
  { key: "name", name: "Name", nowrap: false, href: getSkylinkLink },
  { key: "skylink", name: "Skylink" },
  { key: "size", name: "Size", formatter: ({ size }) => prettyBytes(size) },
  { key: "downloadedOn", name: "Accessed on", formatter: getRelativeDate },
];
const actions = [];

export const getServerSideProps = authServerSideProps(async (context, api) => {
  const initialData = await api.get("user/downloads?pageSize=10&offset=0").json();

  return { props: { initialData } };
});

export default function Downloads({ initialData }) {
  const [offset, setOffset] = useState(0);
  const { data } = useAccountsApi(`${apiPrefix}/user/downloads?pageSize=${pageSize}&offset=${offset}`, {
    initialData: offset === 0 ? initialData : undefined,
    revalidateOnMount: true,
  });

  useAccountsApi(`${apiPrefix}/user/downloads?pageSize=${pageSize}&offset=${offset + pageSize}`); // preload next page

  return (
    <Layout title="Your downloads">
      <Table {...data} headers={headers} actions={actions} setOffset={setOffset} />
    </Layout>
  );
}
