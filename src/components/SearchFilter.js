import { useState } from "react";
import { useSearchParams } from "react-router-dom";

function SearchFilter() {
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState([]);

    // for (let [filter, value] of searchParams.entries()) {
    //     console.log(filter, value);
    //     setFilters((prev) => prev + ", " + value);
    // }

    return (
        <>
            {searchParams && (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            {/* {...Object.fromEntries(searchParams.entries()).map(
                                (e, i) => <button>{i}</button>
                            )} */}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SearchFilter;
