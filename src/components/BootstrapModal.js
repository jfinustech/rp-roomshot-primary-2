import DesignSideModal from "./DesignSideModal";
import SkuTransfer from "./SkuTransfer";
import ImportMissingImages from "./ImportMissingImages";
import AddExtraColorAndDesigns from "./AddExtraColorAndDesigns";
import EditDescription from "./EditDescription";

function BootstrapModal({
    title,
    dataComponent,
    data,
    act,
    size = "modal-xl",
}) {
    return (
        <div
            className="modal fade"
            id="MainModal"
            aria-labelledby="MainModalLabel"
            aria-hidden="true"
        >
            <div className={`modal-dialog ${size}`}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h4
                            className="fw-normal p-0 m-0"
                            id="MainModalLabel"
                            style={{ fontSize: "1.12rem" }}
                        >
                            {title}
                        </h4>
                        <button
                            type="button"
                            className="btn-close px-3"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            style={{ fontSize: 12 }}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {dataComponent === "DesignSideModal" && (
                            <DesignSideModal Items={data} handleItem={act} />
                        )}
                        {dataComponent === "SkuTransfer" && (
                            <SkuTransfer data={data} reloadInitPage={act} />
                        )}
                        {dataComponent === "ImportMissingImages" && (
                            <ImportMissingImages
                                data={data}
                                handleChangeVendor={act}
                            />
                        )}
                        {dataComponent === "AddExtraColorAndDesigns" && (
                            <AddExtraColorAndDesigns
                                data={data}
                                reloadInitPage={act}
                            />
                        )}
                        {dataComponent === "editDescription" && (
                            <EditDescription data={data} reloadInitPage={act} />
                        )}
                    </div>
                    {/* <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                            <button type="button" className="btn btn-primary">
                                Save changes
                            </button>
                        </div> */}
                </div>
            </div>
        </div>
    );
}

export default BootstrapModal;
