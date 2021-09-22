import dayjs from "dayjs";
import prettyBytes from "pretty-bytes";
import { useState } from "react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import authServerSideProps from "../services/authServerSideProps";
import { SkynetClient } from "skynet-js";
import useAccountsApi from "../services/useAccountsApi";

const skynetClient = new SkynetClient(`https://${process.env.PORTAL_DOMAIN}`);
const apiPrefix = process.env.NODE_ENV === "development" ? "/api/stubs" : "";
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
  const { data } = useAccountsApi(`${apiPrefix}/user/uploads?pageSize=10&offset=${offset}`, {
    initialData: offset === 0 ? initialData : undefined,
    revalidateOnMount: true,
  });

  // preload next page if it exists (based on the response from the current page query)
  const nextPageOffset = data && data.offset + data.pageSize < data.count ? data.offset + data.pageSize : offset;
  useAccountsApi(`${apiPrefix}/user/uploads?pageSize=10&offset=${nextPageOffset}`);

  return (
    <Layout title="Your uploads">
      <Table {...data} headers={headers} actions={actions} setOffset={setOffset} />
    </Layout>
  );
}
