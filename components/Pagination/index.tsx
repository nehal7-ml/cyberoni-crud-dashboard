'use client'
import React from 'react';

const   Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (pageNumber: number) => void }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <div className="pagination">
            {pageNumbers.map((pageNumber) => (
                <button
                    key={pageNumber}
                    className={`page-link ${currentPage === pageNumber ? 'active' : ''}`}
                    onClick={() => onPageChange(pageNumber)}
                >
                    {pageNumber}
                </button>
            ))}
        </div>
    );
};

export default Pagination;
