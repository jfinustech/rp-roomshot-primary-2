import { useEffect, useRef, useContext } from "react";
import { MainContext } from "./MainContext";
import { Tooltip } from "bootstrap";
import styles from "../styles/modules/designSectionAction.module.scss";
import { FiTrash2 } from "react-icons/fi";

function DesignSectionAction({ handleSoftDeleteBulk }) {
    const randomid = Math.floor(Math.random() * 99999);
    const {
        hideDeleted,
        dispatchHideDelete,
        hideAssigned,
        dispatchHideAssigned,
    } = useContext(MainContext);

    const btnRef = useRef();

    // console.log(tooltip);

    useEffect(() => {
        new Tooltip(btnRef.current);
    }, []);

    return (
        <>
            <div
                className={`d-flex justify-content-start align-items-center w-100 border-top pt-2 mt-2 mb-5 gap-3 ${styles.actionWrapper}`}
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
                    ref={btnRef}
                    className={`ms-auto btn border border text-muted rounded-pill py-1 px-4 ${styles.btnDeleteAll}`}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-title="This will delete all images that are not assigned as primary or
                    specific shape"
                    onClick={() => handleSoftDeleteBulk()}
                >
                    <FiTrash2 />
                    <span>
                        <small>Soft Delete All Non-Selected Images</small>
                    </span>
                </button>
            </div>
        </>
    );
}

export default DesignSectionAction;
