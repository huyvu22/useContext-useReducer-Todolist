import React, { useEffect, useState, useContext } from 'react';
import ReactPaginate from 'react-paginate';
import { AppContext } from '../Context/AppContext';

const Pagination = (props) => {
    const { dataDispatch } = useContext(AppContext)

    const handlePageClick = (e) => {
        dataDispatch({
            type: 'GET_PAGE',
            page: +e.selected + 1,
        })
    }

    return (
        <div className="text-start py-4">
            <div className="paginate d-md-flex flex-start">
                <ReactPaginate
                    nextLabel="Next >"
                    onPageChange={(e) => handlePageClick(e)}
                    pageRangeDisplayed={3}
                    // marginPagesDisplayed={2}
                    pageCount={props.showState.pageCount}
                    // pageCount={2}
                    previousLabel="< Prev"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                    renderOnZeroPageCount={null}
                />
            </div>
        </div>
    )
}

export default Pagination