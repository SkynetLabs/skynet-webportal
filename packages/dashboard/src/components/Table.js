import { useEffect } from "react";
import classnames from "classnames";

const pageSize = 2;

function Button({ children, disabled, className, ...props }) {
  return (
    <button
      type="button"
      className={classnames(
        "inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white",
        {
          "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500": !disabled,
          "cursor-auto opacity-50": disabled,
        },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default function Table({ data, headers, actions, page, setPage }) {
  const lastPage = Math.ceil(data.length / pageSize);
  const dataSlice = data.slice(pageSize * (page - 1), pageSize * (page - 1) + pageSize);

  useEffect(() => {
    if (page > lastPage) setPage(lastPage);
    if (page < 1) setPage(1);
  }, [page, lastPage, setPage]);

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map(({ key, name }) => (
                    <th
                      key={key}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {name}
                    </th>
                  ))}
                  {actions.map(({ key, name }) => (
                    <th key={key} scope="col" className="relative px-6 py-3">
                      <span className="sr-only">{name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataSlice.map((row, index) => (
                  <tr className={index % 2 ? "bg-white" : "bg-gray-50"} key={index}>
                    {headers.map(({ key, formatter }) => (
                      <td key={key} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(formatter ? formatter(row[key]) : row[key]) || "-"}
                      </td>
                    ))}
                    {actions.map(({ key, name, action }) => (
                      <td key={key} className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900" onClick={action}>
                          {name}
                        </a>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {/* This example requires Tailwind CSS v2.0+ */}
            <nav
              className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
              aria-label="Pagination"
            >
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{data.length ? pageSize * (page - 1) + 1 : 0}</span> to{" "}
                  <span className="font-medium">{pageSize * page > data.length ? data.length : pageSize * page}</span>{" "}
                  of <span className="font-medium">{data.length}</span> results
                </p>
              </div>
              <div className="flex-1 flex justify-between sm:justify-end">
                <Button disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  Previous
                </Button>
                <Button className="ml-3" disabled={page >= lastPage} onClick={() => setPage(page + 1)}>
                  Next
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
