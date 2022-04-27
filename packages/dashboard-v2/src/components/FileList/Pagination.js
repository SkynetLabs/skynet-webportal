import { Button } from "../Button";

export const Pagination = ({ count, offset, setOffset, pageSize }) => {
  const start = count ? offset + 1 : 0;
  const end = offset + pageSize > count ? count : offset + pageSize;

  const showPaginationButtons = offset > 0 || count > end;

  return (
    <nav className="px-4 py-3 flex items-center justify-between" aria-label="Pagination">
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Showing {start} to {end} of {count} results
        </p>
      </div>
      {showPaginationButtons && (
        <div className="flex-1 flex justify-between sm:justify-end space-x-3">
          <Button disabled={offset - pageSize < 0} onClick={() => setOffset(offset - pageSize)} className="!border-0">
            Previous page
          </Button>
          <Button
            disabled={offset + pageSize >= count}
            onClick={() => setOffset(offset + pageSize)}
            className="!border-0"
          >
            Next page
          </Button>
        </div>
      )}
    </nav>
  );
};
