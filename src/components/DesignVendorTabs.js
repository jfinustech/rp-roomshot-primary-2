import axios from "axios";
import { useEffect, useState } from "react";
import { FiAlertTriangle, FiChevronsUp, FiRefreshCw } from "react-icons/fi";
import styles from "../styles/modules/designSection.module.scss";

const VENDOR_URL = "https://sandbx.rugpal.com/office/jay/v2/designs.asp";

function DesignVendorTabs({
    images,
    designFilter,
    handleChangeVendor,
    // forcereload = Math.random(),
}) {
    // console.log(designFilter);

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [vendorTabs, setVendorTabs] = useState([]);
    const [reload, setReload] = useState();

    useEffect(() => {
        const vetchVendorTabs = async () => {
            setIsLoading(true);
            await axios({
                method: "GET",
                url: VENDOR_URL,
                params: {
                    designid: designFilter.designid,
                    designcolor: designFilter.designcolor,
                    action: "VENDORLISTBYDESIGN",
                },
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((d) => {
                    setVendorTabs(d.data);
                    //console.log(d.data);
                    setIsLoading(false);
                    setHasError(false);
                })
                .catch((er) => {
                    setIsLoading(false);
                    setHasError(true);
                });
        };

        vetchVendorTabs();
    }, [designFilter, reload]);

    return (
        <>
            <div
                className={`align-self-stretch flex-shrink-0 d-flex flex-column justify-content-between border-start ${styles.sideSectionSmall}`}
            >
                {isLoading && (
                    <div className="d-flex justify-content-center py-3">
                        <img
                            src={`${process.env.PUBLIC_URL}/images/spinner2.gif`}
                            alt="Loading"
                            style={{ width: 30, height: 30 }}
                        />
                    </div>
                )}

                {hasError && (
                    <div
                        className="d-flex flex-column justify-content-center align-items-center py-3 text-danger"
                        title="Unable to load vendor tabs."
                    >
                        <FiAlertTriangle style={{ fontSize: "20px" }} />

                        <button
                            className="btn mt-2"
                            onClick={() => setReload(Math.random())}
                            title="Re-try"
                        >
                            <FiRefreshCw />
                        </button>
                    </div>
                )}

                {!isLoading && !hasError && (
                    <div
                        className="sticky sticky-top"
                        style={{
                            height: (vendorTabs?.length ?? 1) * 150 - 1 + 49,
                            // scrollMarginBottom: 50,
                            // bottom: 50,
                        }}
                    >
                        <div
                            className={`d-flex justify-content-start align-items-center ${styles.sideSectionSmallTabHolder}`}
                        >
                            {vendorTabs.map((vendor) => (
                                <button
                                    key={vendor.id}
                                    className={`flex-shringk-0 flex-shrink-0 ${
                                        parseInt(designFilter.vendor) ===
                                        parseInt(vendor.id)
                                            ? styles.active
                                            : ""
                                    }`}
                                    onClick={(e) =>
                                        handleChangeVendor(
                                            vendor.id,
                                            vendor.name,
                                            vendor.did,
                                            vendor.didcolor,
                                            vendor.didcollection
                                        )
                                    }
                                >
                                    <span>{vendor.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <button
                    className={`${styles.backToTop} sticky sticky-bottom ms-auto d-flex justify-content-center align-items-center border-end border-top`}
                    onClick={(e) => {
                        if (e.shiftKey) {
                            window.scrollTo(0, 0);
                        } else {
                            e.target.closest("section").scrollIntoView();
                        }
                    }}
                >
                    <FiChevronsUp />
                </button>
            </div>
        </>
    );
}

export default DesignVendorTabs;
