import './Pagination.pcss';
import React from 'react';

interface IPagination {
  totalElements: number;
  elementsPerPage: number;
  paginate: (n: number) => void;
  currentPageNumber: number;
  currentPageIsDone: boolean;
  pagesStatus:boolean[];
}
const Pagination = React.memo((props: IPagination): JSX.Element => {
  const {
    totalElements,
    elementsPerPage,
    paginate,
    currentPageNumber,
    currentPageIsDone,
    pagesStatus,
  } = props;
  const pageNumbers: number[] = Array.from(
    [...Array(totalElements / elementsPerPage).keys()],
    key => key + 1,
  );

  const pageClickHandler = (e: React.MouseEvent, pageNumber: number) => {
    e.preventDefault();
    paginate(pageNumber);
  };

  const pageLinkClasses = (page:number) => {
    if(currentPageNumber === page-1){
      return 'pagelink-active';
    }

    if(currentPageNumber === page-1 && currentPageIsDone){
      return 'pagelink-done';
    }

    if(pagesStatus){
      return pagesStatus[page-1] ? 'pagelink-done' : '';
    }
    return '';
  };

  return (
    <nav>
      <ul className="pages-list">
        {pageNumbers.map(pageNumber => (
          <li key={pageNumber} className={pageLinkClasses(pageNumber)}>
            <a onClick={e => pageClickHandler(e, pageNumber)} href="!#">
              {pageNumber}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
});
export default Pagination;
