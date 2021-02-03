const rowsPerPage = 10;

export default function Table({ data, headers, actions, page, setPage }) {
  const lastPage = Math.ceil(data.length / rowsPerPage);

  if (page > lastPage) setPage(lastPage);

  const dataSlice = data.slice(rowsPerPage * (page - 1), rowsPerPage * (page - 1) + rowsPerPage);

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
                    {headers.map(({ key, name }) => (
                      <td key={key} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row[key] || "-"}
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
                  Showing <span className="font-medium">{rowsPerPage * (page - 1) + 1}</span> to{" "}
                  <span className="font-medium">
                    {rowsPerPage * page > data.length ? data.length : rowsPerPage * page}
                  </span>{" "}
                  of <span className="font-medium">{data.length}</span> results
                </p>
              </div>
              <div className="flex-1 flex justify-between sm:justify-end">
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => (page > 1 ? setPage(page - 1) : undefined)}
                >
                  Previous
                </a>
                <a
                  href="#"
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => (page < lastPage ? setPage(page + 1) : undefined)}
                >
                  Next
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
