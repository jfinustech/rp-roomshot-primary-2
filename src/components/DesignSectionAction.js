import { useEffect, useRef, useContext } from "react";
import { MainContext } from "./MainContext";
import { Tooltip } from "bootstrap";
import styles from "../styles/modules/designSectionAction.module.scss";
import { FiTrash2, FiCopy, FiGrid, FiImage } from "react-icons/fi";
import UploadFile from "./UploadFile";
import { HandleModal } from "../aux/HandleModal";

function DesignSectionAction({
    handleSoftDeleteBulk,
    designid,
    designcolor,
    vendor,
    vendorname,
    collection,
    handleUploadResponse,
    reloadInitPage,
}) {
    const randomid = Math.floor(Math.random() * 99999);
    const {
        hideDeleted,
        dispatchHideDelete,
        hideAssigned,
        dispatchHideAssigned,
        galleryMode,
        dispatchGalleryMode,
    } = useContext(MainContext);

    const btnDeleteRef = useRef();
    const btnTransferRef = useRef();

    const handleSkuTransfer = (e) => {
        e.preventDefault();

        HandleModal(
            "SKU Transfer",
            "SkuTransfer",
            {
                vendor,
                vendorname,
                designid,
                designcolor,
                collection,
            },
            reloadInitPage,
            "modal-lg"
        );
    };

    const handleGalleryModeToggle = () => {
        dispatchGalleryMode({
            type: "TOGGLE_GALLERY_MODE",
            payload: !galleryMode,
        });
    };

    const handleImortMissingImages = () => {
        HandleModal(
            "Import Missing Images",
            "ImportMissingImages",
            {
                collection,
                designid,
                designcolor,
            },
            reloadInitPage,
            "modal-lg"
        );
    };

    // console.log(tooltip);

    useEffect(() => {
        // new Tooltip(btnDeleteRef.current);
        // if (btnTransferRef.current) new Tooltip(btnTransferRef.current);

        const btns = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        btns.forEach((btn) => {
            new Tooltip(btn);
        });
    }, []);

    return (
        <>
            <div
                className={`d-flex justify-content-start align-items-start w-100 border-top pt-2 mt-2 mb-5 gap-3 ${styles.actionWrapper}`}
            >
                <div className="cursor-pointer form-check form-switch user-select-none">
                    <input
                        className="form-check-input cursor-pointer"
                        type="checkbox"
                        role="switch"
                        id={`hidedeleted-${randomid}`}
                        checked={hideDeleted === "1"}
                        onChange={(e) =>
                            dispatchHideDelete({
                                type: "HIDE_DELETED",
                                payload: e.target.checked ? "1" : "0",
                            })
                        }
                    />
                    <label
                        className="form-check-label cursor-pointer"
                        htmlFor={`hidedeleted-${randomid}`}
                    >
                        Hide Deleted
                    </label>
                </div>
                <div className="cursor-pointer form-check form-switch user-select-none">
                    <input
                        className="form-check-input cursor-pointer"
                        type="checkbox"
                        role="switch"
                        id={`hideassigned-${randomid}`}
                        checked={hideAssigned === "1"}
                        onChange={(e) => {
                            dispatchHideAssigned({
                                type: "HIDE_ASSIGNED",
                                payload: e.target.checked ? "1" : "0",
                            });
                        }}
                    />
                    <label
                        className="form-check-label cursor-pointer"
                        htmlFor={`hideassigned-${randomid}`}
                    >
                        Hide Assigned
                    </label>
                </div>
                <button
                    className={`ms-auto btn border border text-muted rounded-1 py-1 px-4 ${
                        styles.btnGallery
                    } ${galleryMode ? styles.active : ""}`}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="Gallery Mode"
                    onClick={handleGalleryModeToggle}
                >
                    <FiGrid />
                </button>
                <button
                    ref={btnDeleteRef}
                    className={`btn border border text-muted rounded-1 py-1 px-4 ${styles.btnDeleteAll}`}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="Import Missing Images"
                    onClick={handleImortMissingImages}
                >
                    <FiImage />
                </button>
                <button
                    ref={btnDeleteRef}
                    className={`btn border border text-muted rounded-1 py-1 px-4 ${styles.btnDeleteAll}`}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="This will delete all images that are not assigned as primary or
                    specific shape"
                    onClick={() => handleSoftDeleteBulk()}
                >
                    <FiTrash2 />
                </button>
                {parseInt(vendor) === 8800 && (
                    <button
                        ref={btnTransferRef}
                        className={`btn border border text-muted rounded-1 py-1 px-4 ${styles.btnDeleteAll}`}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        data-bs-title="Transfer items whithin this design or collection to a new brand."
                        onClick={handleSkuTransfer}
                    >
                        <FiCopy />
                    </button>
                )}
                <UploadFile
                    designid={designid}
                    designcolor={designcolor}
                    handleUploadResponse={handleUploadResponse}
                />
            </div>
        </>
    );
}

export default DesignSectionAction;
