import React from 'react';

const Pagination = ({ page, totalPages, onPageChange }) => {
    const getPages = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else if (page <= 3) {
            pages.push(1, 2, 3, '...', totalPages);
        } else if (page > totalPages - 3) {
            pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
        }
        return pages;
    };

    return (
        <nav aria-label="Paginação">
            <ul className="pagination justify-content-end mb-0">
                <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                    <button type="button" className="page-link" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
                        Anterior
                    </button>
                </li>
                {getPages().map((pageNumber, index) => (
                    pageNumber === '...' ? (
                        <li key={`ellipsis-${index}`} className="page-item disabled"><span className="page-link">...</span></li>
                    ) : (
                        <li key={pageNumber} className={`page-item ${pageNumber === page ? 'active' : ''}`}>
                            <button type="button" className="page-link" onClick={() => onPageChange(pageNumber)}>
                                {pageNumber}
                            </button>
                        </li>
                    )
                ))}
                <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
                    <button type="button" className="page-link" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
                        Próximo
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
