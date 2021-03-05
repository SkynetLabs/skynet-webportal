import { useEffect } from "react";
import classnames from "classnames";

function Button({ children, disabled, className, ...props }) {
  return (
    <button
      type="button"
      className={classnames(
        "inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white",
        {
          "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500": !disabled,
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

export default function Table({ items, count, headers, actions, offset, setOffset, pageSize = 10 }) {
  useEffect(() => {
    if (offset < 0) setOffset(0);
    else if (offset >= count && count > 0) setOffset(Math.floor(count / pageSize - 1) * pageSize);
    else if (offset % pageSize) setOffset(offset - (offset % pageSize));
  }, [offset, pageSize, setOffset]);

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
                      className="px-6 py-3 whitespace-nowrap text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                {items && items.length ? (
                  items.map((row, index) => (
                    <tr className={index % 2 ? "bg-gray-100" : "bg-white"} key={index}>
                      {headers.map(({ key, formatter, href, nowrap = true }) => (
                        <td
                          key={key}
                          className={`${nowrap ? "whitespace-nowrap" : ""} px-6 py-4 text-sm font-medium text-gray-900`}
                        >
                          {(formatter ? (
                            formatter(row, key)
                          ) : href ? (
                            <a
                              href={href(row, key)}
                              className="text-green-600 hover:text-green-900"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {row[key]}
                            </a>
                          ) : (
                            row[key]
                          )) || <>&mdash;</>}
                        </td>
                      ))}
                      {actions.map(({ key, name, action }) => (
                        <td key={key} className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a href="#" className="text-green-600 hover:text-green-900" onClick={action}>
                            {name}
                          </a>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white">
                    <td colspan={headers.length + actions.length} className="text-center px-6 py-6 text-sm font-medium">
                      no entries
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* This example requires Tailwind CSS v2.0+ */}
            <nav
              className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
              aria-label="Pagination"
            >
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{count ? offset + 1 : 0}</span> to{" "}
                  <span className="font-medium">{offset + pageSize > count ? count : offset + pageSize}</span> of{" "}
                  <span className="font-medium">{count}</span> results
                </p>
              </div>
              <div className="flex-1 flex justify-between sm:justify-end">
                <Button disabled={offset - pageSize < 0} onClick={() => setOffset(offset - pageSize)}>
                  Previous
                </Button>
                <Button
                  className="ml-3"
                  disabled={offset + pageSize >= count}
                  onClick={() => setOffset(offset + pageSize)}
                >
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
