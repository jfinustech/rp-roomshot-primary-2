import { FiRotateCw } from "react-icons/fi";

function ImportMissingImagesTransfer({
    vendor,
    vendorname,
    collection,
    designid,
    designcolor,
    handleChangeVendor,
}) {
    return (
        <div>
            <div className="row">
                <div className="col-3">
                    <button className="btn btn-outline-primary rounded-1">
                        <FiRotateCw />
                        <span className="ms-2">Load Images</span>
                    </button>
                </div>
                <div className="col-9">{}</div>
            </div>
        </div>
    );
}

export default ImportMissingImagesTransfer;
