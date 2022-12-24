import DesignSideModal from "./DesignSideModal";

function BootstrapModal({ title, dataComponent, data }) {
    return (
        <div
            className="modal fade"
            id="MainModal"
            // tabIndex="-1"
            aria-labelledby="MainModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="MainModalLabel">
                            {title}
                        </h1>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        {dataComponent === "DesignSideModal" && (
                            <DesignSideModal Items={data} />
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
