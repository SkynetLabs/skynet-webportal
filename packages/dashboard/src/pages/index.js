import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import prettyBytes from "pretty-bytes";
import Link from "next/link";
import Layout from "../components/Layout";
import authServerSideProps from "../services/authServerSideProps";
import { SkynetClient } from "skynet-js";
import config from "../config";
import useAccountsApi from "../services/useAccountsApi";
import { isFreeTier } from "../services/tiers";
import { write } from "clipboardy";

dayjs.extend(relativeTime);

const skynetClient = new SkynetClient(process.env.NEXT_PUBLIC_SKYNET_PORTAL_API);
const apiPrefix = process.env.NODE_ENV === "development" ? "/api/stubs" : "";

export const getServerSideProps = authServerSideProps(async (context, api) => {
  const stripe = await api.get("stripe/prices").json();
  const plans = [config.tiers.starter, ...stripe].sort((a, b) => a.tier - b.tier);

  return { props: { plans } };
});

function SkylinkList({ items = [], timestamp }) {
  return (
    <ul className="divide-y divide-gray-200">
      {items.slice(0, 3).map((item) => (
        <li key={item.id}>
          <div className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <a
                href={skynetClient.getSkylinkUrl(item.skylink)}
                className="text-sm font-medium text-green-600 hover:text-green-900 truncate"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.name || "— file name not available —"}
              </a>
              <abbr
                className="text-xs text-gray-400 whitespace-nowrap ml-2 cursor-pointer"
                title="Click to copy"
                onClick={() => write(`sia://${item.skylink}`)}
              >
                sia://{item.skylink.substr(0, 5)}…{item.skylink.substr(-5)}
              </abbr>
            </div>
            <div className="mt-2 sm:flex sm:justify-between">
              <div className="sm:flex">
                <p className="flex items-center text-sm text-gray-500">
                  <svg
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                  {prettyBytes(item.size)}
                </p>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                <svg
                  className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                {item[timestamp] && <time dateTime={item[timestamp]}>{dayjs(item[timestamp]).fromNow()}</time>}
              </div>
            </div>
          </div>
        </li>
      ))}

      {!items.length && (
        <li>
          <div className="px-4 py-4 sm:px-6">
            <p className="text-sm text-gray-500">no entries yet</p>
          </div>
        </li>
      )}
    </ul>
  );
}

export default function Home({ plans }) {
  const { data: user } = useAccountsApi(`${apiPrefix}/user`);
  const { data: stats } = useAccountsApi(`${apiPrefix}/user/stats`);
  const { data: downloads } = useAccountsApi(`${apiPrefix}/user/downloads?pageSize=3&offset=0`);
  const { data: uploads } = useAccountsApi(`${apiPrefix}/user/uploads?pageSize=3&offset=0`);

  const activePlan = plans.find(({ tier }) => (user ? user.tier === tier : isFreeTier(tier)));

  return (
    <Layout title="Dashboard">
      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
          <div className="flex flex-col bg-white overflow-hidden shadow rounded-lg">
            <div className="flex-grow px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  {/* Heroicon name: outline/users */}
                  <svg
                    className="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Current plan</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{activePlan.name}</div>
                  </dd>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link href="/payments">
                  <a className="font-medium text-green-600 hover:text-green-500 flex items-center">
                    Check upgrade options
                    <svg
                      className="h-4 w-4 ml-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                    <svg
                      className="h-4 w-4 ml-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-white overflow-hidden shadow rounded-lg">
            <div className="flex-grow px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Storage used</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-grey-900">
                      {prettyBytes(stats?.totalUploadsSize ?? 0)}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link href="/uploads">
                  <a className="font-medium text-green-600 hover:text-green-500">View all uploads</a>
                </Link>
              </div>
            </div>
          </div>
          {/* <div className="flex flex-col bg-white overflow-hidden shadow rounded-lg">
            <div className="flex-grow px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-white transform rotate-45"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Bandwidth used</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-grey-900">{prettyBytes(stats?.bwDownloads ?? 0)}</div>
                  </dd>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link href="/downloads">
                  <a className="font-medium text-green-600 hover:text-green-500">View all downloads</a>
                </Link>
              </div>
            </div>
          </div> */}
        </dl>

        {/* ============  */}

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col">
            <h3 className="pb-5 text-lg leading-6 font-medium text-gray-900">Recent downloads</h3>

            {/* This example requires Tailwind CSS v2.0+ */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <SkylinkList items={downloads?.items} timestamp="downloadedOn" />
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="pb-5 text-lg leading-6 font-medium text-gray-900">Recent uploads</h3>

            {/* This example requires Tailwind CSS v2.0+ */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <SkylinkList items={uploads?.items} timestamp="uploadedOn" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
