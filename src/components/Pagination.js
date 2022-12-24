import { useState } from "react";
import { BiChevronRight, BiChevronLeft } from "react-icons/bi";

const Pagination = ({ current_page, maxpage, handleQuery, isLoading }) => {
    const [inputval, setInputval] = useState(
        current_page === "" ? 1 : current_page
    );

    const handleInput = (e) => {
        setInputval(e.target.value);
        const timeout = setTimeout(() => {
            handleQuery({
                page:
                    e.target.value < 1
                        ? 1
                        : e.target.value > maxpage
                        ? maxpage
                        : e.target.value,
            });
        }, 250);

        return () => clearTimeout(timeout);
    };

    const handleClick = (direction) => {
        const new_page_number =
            direction === "next"
                ? parseInt(current_page) === parseInt(maxpage)
                    ? maxpage
                    : parseInt(current_page) + 1
                : parseInt(current_page) <= 1
                ? 1
                : parseInt(current_page) - 1;

        setInputval(new_page_number);
        handleQuery({ page: new_page_number });
    };

    return (
        <>
            {maxpage > 0 && (
                <div className="container-fluid container-lg mb-4">
                    <div className="row mt-5">
                        <div className="col text-center">
                            <div
                                className="btn-group mt-3 align-items-center gap-2"
                                role="group"
                            >
                                <button
                                    type="button"
                                    className="p-0 m-0 d-flex align-items-center justify-content-center paging-btn btn btn-lg border-0 rounded-pill btn-outline-secondary user-select-none"
                                    onClick={() => handleClick("prev")}
                                    disabled={
                                        parseInt(current_page) === 1 ||
                                        isLoading
                                    }
                                >
                                    <BiChevronLeft />
                                </button>

                                <input
                                    className="paging-inp text-center py-2 m-0 pager rounded-pill"
                                    type="text"
                                    step="1"
                                    min="1"
                                    value={inputval}
                                    onChange={(e) => handleInput(e)}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="p-0 m-0 d-flex align-items-center justify-content-center paging-btn btn btn-lg border-0 rounded-pill btn-outline-secondary user-select-none"
                                    onClick={() => handleClick("next")}
                                    disabled={
                                        parseInt(current_page) ===
                                            parseInt(maxpage) || isLoading
                                    }
                                >
                                    <BiChevronRight />
                                </button>
                            </div>
                            <div className="d-block">
                                <small>Max Page: {maxpage}</small>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Pagination;
