import React from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  totalItems
}) => {
  // Create an array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Show at most 5 page numbers
    
    if (totalPages <= maxPagesToShow) {
      // If we have 5 or fewer pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include page 1
      pages.push(1);
      
      // Calculate start and end of the current window
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust the window if we're near the start or end
      if (currentPage <= 3) {
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis after page 1 if needed
      if (startPage > 2) {
        pages.push(-1); // Use -1 as a marker for ellipsis
      }
      
      // Add the window of pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before the last page if needed
      if (endPage < totalPages - 1) {
        pages.push(-2); // Use -2 as another marker for ellipsis
      }
      
      // Always include the last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  // Calculate the range of items being displayed
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  
  return (
    <div className={styles.paginationContainer}>
      <div className={styles.pageInfo}>
        {totalItems > 0 ? (
          <>Showing {startItem}-{endItem} of {totalItems} items</>
        ) : (
          <>No items to display</>
        )}
      </div>
      
      <div className={styles.pagination}>
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || totalPages === 0}
          className={styles.pageButton}
          title="First page"
        >
          &laquo;
        </button>
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || totalPages === 0}
          className={styles.pageButton}
          title="Previous page"
        >
          &lsaquo;
        </button>
        
        {getPageNumbers().map((page, index) => (
          page < 0 ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={page === currentPage}
              className={`${styles.pageButton} ${page === currentPage ? styles.activePage : ''}`}
            >
              {page}
            </button>
          )
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={styles.pageButton}
          title="Next page"
        >
          &rsaquo;
        </button>
        
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={styles.pageButton}
          title="Last page"
        >
          &raquo;
        </button>
      </div>
      
      <div className={styles.pageSize}>
        <label htmlFor="page-size">Items per page:</label>
        <select 
          id="page-size"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className={styles.pageSizeSelect}
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;