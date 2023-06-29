import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import DesignSection from "./components/DesignSection";
import Pagination from "./components/Pagination";
import Loading from "./components/Loading";
import { MainContext } from "./components/MainContext";

const VIEW_URL = "https://sandbx.rugpal.com/office/jay/v2/designs.asp";
function App() {
    const [designs, setDesigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const { mainVendor } = useContext(MainContext);
    const [reloadPage, setReloadPage] = useState();

    const handleQuery = (q) => {
        const new_query = {
            ...Object.fromEntries(searchParams.entries()),
            ...q,
        };
        setSearchParams(new_query);
        //Some note here.
    };

    useEffect(() => {
        const fetchInitPage = async () => {
            setIsLoading(true);
            await axios({
                method: "POST",
                url: VIEW_URL,
                params: {
                    page: searchParams.get("page"),
                    search: searchParams.get("search"),
                    vendor: mainVendor,
                },
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((d) => {
                    setDesigns(d.data);
                })
                .catch((er) => {
                    setHasError(true);
                    setErrorMessage(er.message);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        };

        fetchInitPage();
    }, [searchParams, mainVendor, reloadPage]);

    return (
        <div className="container-fluid my-3">
            {isLoading && (
                <div id="loadingwrapper">
                    <Loading cover={true} />
                </div>
            )}
            {hasError && <div>{errorMessage}</div>}
            {!hasError && designs.length > 0 && (
                <>
                    {designs.map((design) => (
                        <DesignSection
                            key={design.id}
                            design={design}
                            reloadInitPage={setReloadPage}
                        />
                    ))}
                    <Pagination
                        current_page={searchParams.get("page") ?? 1}
                        maxpage={designs ? designs[0].total_page : 1}
                        handleQuery={handleQuery}
                        isLoading={isLoading}
                    />
                </>
            )}
            {!isLoading && !hasError && designs.length <= 0 && (
                <div>No Data</div>
            )}
        </div>
    );
}

export default App;
