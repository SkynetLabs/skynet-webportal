import useSWR from "swr";
import dayjs from "dayjs";

import UserSettingsLayout from "../../layouts/UserSettingsLayout";

import { TextInputBasic } from "../../components/TextInputBasic";
import { Button } from "../../components/Button";
import { TrashIcon } from "../../components/Icons";

const APIKeysPage = () => {
  const { data: apiKeys } = useSWR("user/apikeys");

  return (
    <>
      <div className="flex flex-col xl:flex-row">
        <div className="flex flex-col gap-10 lg:shrink-0 lg:max-w-[576px] xl:max-w-[524px]">
          <section>
            <h4>API Keys</h4>
            <p>
              At vero eos et caritatem, quae sine metu contineret, saluti prospexit civium, qua. Laudem et dolorem
              aspernari ut ad naturam aut fu.
            </p>
          </section>
          <hr />
          <section className="flex flex-col gap-8">
            <div className="grid sm:grid-cols-[1fr_min-content] w-full gap-y-2 gap-x-4 items-end">
              <TextInputBasic label="API Key Name" placeholder="my_applications_statistics" />
              <div className="flex mt-2 sm:mt-0 justify-center">
                <Button onClick={() => console.info("TODO: generate ky")}>Generate</Button>
              </div>
            </div>
          </section>
          {apiKeys?.length > 0 && (
            <section className="mt-4">
              <h6 className="text-palette-300">API Keys</h6>
              <ul className="mt-4">
                {apiKeys.map(({ id, name, createdAt }) => (
                  <li
                    key={id}
                    className="grid grid-cols-2 sm:grid-cols-[1fr_repeat(2,_max-content)] py-6 sm:py-4 px-4 gap-x-8 bg-white odd:bg-palette-100/50"
                  >
                    <span className="truncate col-span-2 sm:col-span-1">{name || id}</span>
                    <span className="col-span-2 my-4 border-t border-t-palette-200/50 sm:hidden" />
                    <span className="text-palette-400">{dayjs(createdAt).format("MMM DD, YYYY")}</span>
                    <span className="text-right">
                      <button
                        className="p-1 transition-colors hover:text-error"
                        onClick={() => window.confirm("TODO: confirmation modal")}
                      >
                        <TrashIcon size={14} />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <div className="hidden xl:block w-full text-right pt-20 pr-6">
          <img src="/images/import-export.svg" alt="" className="inline-block w-[200px]" />
        </div>
      </div>
    </>
  );
};

APIKeysPage.Layout = UserSettingsLayout;

export default APIKeysPage;
