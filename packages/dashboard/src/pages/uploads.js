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
const fetcher = (url) => fetch(url).then((r) => r.json());
const getSkylinkLink = ({ skylink }) => skynetClient.getSkylinkUrl(skylink);
const getRelativeDate = ({ uploadedOn }) => dayjs(uploadedOn).format("YYYY-MM-DD HH:mm:ss");
const headers = [
  { key: "name", name: "Name", nowrap: false, href: getSkylinkLink },
  { key: "skylink", name: "Skylink" },
  { key: "size", name: "Size", formatter: ({ size }) => prettyBytes(size) },
  { key: "uploadedOn", name: "Uploaded on", formatter: getRelativeDate },
];
const actions = [];

export const getServerSideProps = authServerSideProps(async (context, api) => {
  const initialData = await api.get("user/uploads?pageSize=10&offset=0").json();

  return { props: { initialData } };
});

export default function Uploads({ initialData }) {
  const [offset, setOffset] = useState(0);
  const { data } = useAccountsApi(`${apiPrefix}/user/uploads?pageSize=10&offset=${offset}`, { initialData });

  return (
    <Layout title="Your uploads">
      <Table {...data} headers={headers} actions={actions} setOffset={setOffset} />
    </Layout>
  );
}
