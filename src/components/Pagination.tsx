export default function Pagination({
  onPageChange,
  currentPageCount,
  campgroundsCount,
}) {
  const productsPerPage = 20;
  const maxPageNumber = Math.ceil(campgroundsCount / productsPerPage);
  return (
    <>
      <ul className="pagination justify-content-center">
        <li
          className={`page-item ${currentPageCount <= 1 ? 'disabled' : ''}`}
          onClick={() =>
            currentPageCount - 1 <= 0 ? null : onPageChange((currentPageCount - 1))
          }
        >
          <a className="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {Array(maxPageNumber)
          .fill(undefined)
          .map((_, i) => (
            <li key={i} className="page-item">
              <a
                className="page-link"
                href="#"
                onClick={() => onPageChange(i+1)}
              >
                {i + 1}
              </a>
            </li>
          ))}

        <li
          className={`page-item ${currentPageCount === maxPageNumber ? 'disabled' : ''}`}
          onClick={() =>
            currentPageCount + 1 > maxPageNumber ? null : onPageChange(currentPageCount + 1)
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
