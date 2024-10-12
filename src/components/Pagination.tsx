export default function Pagination({
  onPageChange,
  currentPageCount,
  campgroundsCount,
  productsPerPage,
}) {
  const totalPages = Math.ceil(campgroundsCount / productsPerPage);
  const maxPageNumber = Math.min(totalPages, 10);
  let startPage =
    currentPageCount < maxPageNumber / 2
      ? 1
      : Math.floor(currentPageCount - maxPageNumber / 2);
  if (totalPages - startPage < maxPageNumber) {
    startPage = totalPages + 1 - maxPageNumber;
  }
  return (
    <>
      <ul className="pagination justify-content-center mt-3">
        <li
          className={`page-item ${currentPageCount <= 1 ? "disabled" : ""}`}
          onClick={() =>
            currentPageCount - 1 <= 0
              ? null
              : onPageChange(currentPageCount - 1)
          }
        >
          <a className="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {Array(maxPageNumber)
          .fill(undefined)
          .map((_, i) => {
            if (startPage + i > totalPages) {
              return;
            }

            return (
              <li key={i + startPage} className="page-item">
                <a
                  className="page-link"
                  href="#"
                  onClick={() => onPageChange(i + startPage)}
                >
                  {i + startPage}
                </a>
              </li>
            );
          })}

        <li
          className={`page-item ${
            currentPageCount >= totalPages ? "disabled" : ""
          }`}
          onClick={() =>
            currentPageCount + 1 > totalPages
              ? null
              : onPageChange(currentPageCount + 1)
          }
        >
          <a className="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </>
  );
}
