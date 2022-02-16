import dayjs from "dayjs";
import prettyBytes from "pretty-bytes";
import { useState } from "react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import { SkynetClient } from "skynet-js";
import useAccountsApi from "../services/useAccountsApi";

const skynetClient = new SkynetClient(process.env.NEXT_PUBLIC_SKYNET_PORTAL_API);
const getSkylinkLink = ({ skylink }) => skynetClient.getSkylinkUrl(skylink);
const getRelativeDate = ({ downloadedOn }) => dayjs(downloadedOn).format("YYYY-MM-DD HH:mm:ss");
const headers = [
  {
    key: "name",
    name: "File",
    formatter: ({ name, skylink }) => (
      <>
        <p>
          <a
            href={getSkylinkLink({ skylink })}
            className="text-green-600 hover:text-green-900 break-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            {name}
          </a>
        </p>
        <p className="text-gray-500 text-xs">{skylink}</p>
      </>
    ),
  },
  { key: "size", name: "Size", formatter: ({ size }) => prettyBytes(size) },
  { key: "downloadedOn", name: "Accessed on", formatter: getRelativeDate },
];
const actions = [];

export default function Downloads() {
  const [offset, setOffset] = useState(0);
  const { data } = useAccountsApi(`user/downloads?pageSize=10&offset=${offset}`, {
    revalidateOnMount: true,
  });

  // preload next page if it exists (based on the response from the current page query)
  const nextPageOffset = data && data.offset + data.pageSize < data.count ? data.offset + data.pageSize : offset;
  useAccountsApi(`user/downloads?pageSize=10&offset=${nextPageOffset}`);

  return (
    <Layout title="Your downloads">
      <Table {...data} headers={headers} actions={actions} setOffset={setOffset} />
    </Layout>
  );
}
