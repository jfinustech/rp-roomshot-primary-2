import { useState, useEffect } from "react";
import axios from "axios";
import { loadingRaw } from "./Loading";

const VIEW_URL = "https://sandbx.rugpal.com/office/jay/v2/designs.asp";

function EditDescription({ data, reloadInitPage }) {
    const [description, setDescription] = useState("");
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const saveDescription = async () => {
        if (description === "" || typeof description === "undefined")
            return alert("Invalid description.");

        setIsLoading(true);
        await axios({
            method: "POST",
            url: VIEW_URL,
            params: {
                vendor: data.vendor,
                collection: data.collection,
                search: description,
                action: "UPDATEDESCRIPTION",
            },
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((d) => {
                setDescription(d.data[0]?.description);
            })
            .catch((er) => {
                setHasError(true);
                setErrorMessage(er.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        const fetchDescription = async () => {
            await axios({
                method: "POST",
                url: VIEW_URL,
                params: {
                    vendor: data.vendor,
                    collection: data.collection,
                    action: "GETDESCRIPTION",
                },
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((d) => {
                    setDescription(d.data[0]?.description);
                    setIsLoading(false);
                })
                .catch((er) => {
                    setHasError(true);
                    setErrorMessage(er.message);
                    setIsLoading(false);
                });
        };

        fetchDescription();
    }, [data.vendor, data.collection]);

    return (
        <>
            {hasError && (
                <div className="p-3 mb-3 border-bottom border-danger text-danger">
                    {errorMessage}
                </div>
            )}
            <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="text-center w-100">
                        <span className="text-muted">Vendor:</span>{" "}
                        {data.vendorname}
                    </div>
                    <div className="border-end py-3"></div>
                    {/* <div className="text-center w-100">
                        <span className="text-muted">Design ID:</span>{" "}
                        {data.designid}
                    </div>
                    <div className="border-end py-3"></div> */}
                    <div className="text-center w-100">
                        <span className="text-muted">Collection:</span>{" "}
                        {data.collection}
                    </div>
                </div>
                {isLoading && <div className="py-4">{loadingRaw}</div>}
                {!isLoading && (
                    <>
                        <textarea
                            cols="30"
                            rows="10"
                            className="border-start-0 border-end-0 border-top border-bottom rounded-0 py-3 form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                        <div className="text-end d-block mt-3">
                            <button
                                type="button"
                                className="btn btn-outline-primary btn-md"
                                onClick={saveDescription}
                            >
                                Save Description
                            </button>
                        </div>
                    </>
                )}
            </>
        </>
    );
}

export default EditDescription;
