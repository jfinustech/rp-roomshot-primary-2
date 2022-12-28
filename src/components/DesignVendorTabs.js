import { FiChevronsUp } from "react-icons/fi";
import styles from "../styles/modules/designSection.module.scss";

function DesignVendorTabs({ images, designFilter, handleChangeVendor }) {
    return (
        <>
            <div
                className={`align-self-stretch flex-shrink-0 d-flex flex-column justify-content-between border-start ${styles.sideSectionSmall}`}
            >
                <div
                    className="sticky sticky-top"
                    style={{
                        height: (images?.vendors?.length ?? 1) * 150 - 1 + 49,
                        // scrollMarginBottom: 50,
                        // bottom: 50,
                    }}
                >
                    <div
                        className={`d-flex justify-content-start align-items-center ${styles.sideSectionSmallTabHolder}`}
                    >
                        {images?.vendors.map((vendor) => (
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
