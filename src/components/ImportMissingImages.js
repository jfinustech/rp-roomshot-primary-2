import axios from "axios";
import { useEffect, useState } from "react";
import { FiDownload, FiDownloadCloud } from "react-icons/fi";
import Loading from "./Loading";
import styles from "../styles/modules/importMissingImages.module.scss";
import ImportMissingImagesImage from "./ImportMissingImagesImage";
import ImportMissingImageFromLink from "./ImportMissingImageFromLink";

const URL = "https://sandbx.rugpal.com/office/jay/v2/designs.asp";
const IMAGE_URL = "https://sandbx.rugpal.com/office/jay/v2/images/collect.php";
const IMAGE_RECORD_URL =
    "https://sandbx.rugpal.com/office/jay/v2/upload_fetch/";

function ImportMissingImages({
    data: { vendor, vendorname, collection, designid, designcolor },
    handleChangeVendor,
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [shapes, setShapes] = useState([]);
    const [shapeSelected, setShapeSelected] = useState([]);
    const [skuCollection, setSkuCollection] = useState(false);

    const [isLoadingImages, setIsLoadingImages] = useState(false);
    const [hasErrorImages, setHasErrorImages] = useState(false);
    const [imageData, setImageData] = useState([]);
    const [hasImageToTransfer, setHasImageToTransfer] = useState(false);
    const [activeTab, setActiveTab] = useState("direct-import");

    const [dataIsTransfering, setDataIsTransfering] = useState(false);
    const [hasErrorTransferingImages, setHasErrorTransferingImages] =
        useState(false);
    const [refetch, setRefetch] = useState();

    const fetchImageImages = async () => {
        setIsLoadingImages(true);
        setHasErrorImages(false);
        setHasImageToTransfer(false);

        await axios({
            method: "POST",
            url: IMAGE_URL,
            data: {
                designid: designid,
                designcolor: designcolor,
                sku: shapeSelected,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then((d) => {
                setHasErrorImages(false);
                setIsLoadingImages(false);

                if (d.data.result !== "success") {
                    setHasErrorImages(true);
                    setErrorMessage(d.data.data);
                } else {
                    setImageData(d.data);
                }
            })
            .catch((er) => {
                setIsLoadingImages(false);
                setHasErrorImages(true);
                setErrorMessage(er.message);
            });
    };

    const handleSelectedShapes = (e) => {
        const input_type = e.currentTarget.type;
        let currentlist = shapeSelected;
        const checked =
            input_type === "checkbox"
                ? e.currentTarget.checked
                : e.currentTarget.value !== "";
        const value = e.currentTarget.value;
        const shapecheckboxes = document.querySelectorAll(".shapeinput");

        if (input_type === "text" && checked) {
            shapecheckboxes.forEach((e) => {
                e.checked = false;
                e.disabled = true;
            });

            currentlist = [value];
        } else {
            shapecheckboxes.forEach((e) => {
                e.disabled = false;
            });
        }

        if (checked) {
            currentlist = [...currentlist, value];
        } else {
            currentlist.splice(currentlist.indexOf(value), 1);
        }

        currentlist = [...new Set(currentlist)];

        setShapeSelected([...new Set(currentlist)]);

        if (currentlist.length === 1) {
            const sku_list =
                shapes.filter((a) => a.sku === currentlist[0]) ?? false;
            const skus = sku_list ? sku_list[0].skus.split(",") : [];
            setSkuCollection(skus);
        } else {
            setSkuCollection(false);
        }
    };

    const handleSkuCollectionChange = (e) => {
        const new_sku = e.target.value;
        setShapeSelected([new_sku]);
        fetchImageImages();
    };

    const handleSelectedImages = (index) => {
        const imagelist = imageData;
        imagelist.images[index].selected = !imagelist.images[index].selected;
        setImageData(imagelist);
        setRefetch(Math.random());

        for (let item of imagelist.images) {
            if (item.selected) {
                return setHasImageToTransfer(true);
            }
        }

        setHasImageToTransfer(false);

        //check if any images slected yet
        //setHasImageToTransfer
    };

    const handleTransferImages = async (withshape) => {
        if (!hasImageToTransfer)
            return alert("Select at least one images to transfer.");

        setDataIsTransfering(true);
        setHasErrorTransferingImages(false);
        const wrapper = document.querySelector(".modal");

        for await (let item of imageData.images) {
            if (item.selected) {
                await axios({
                    method: "POST",
                    url: IMAGE_RECORD_URL,
                    data: {
                        name: item.filename,
                        image: item.path,
                        designid: item.did,
                        color: item.color,
                        shape: withshape ? item.shape : "",
                    },
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                })
                    .catch((err) => {
                        setErrorMessage(err);
                        setHasErrorTransferingImages(true);
                    })
                    .finally(() => {
                        wrapper.scroll({ top: 0, behavior: "smooth" });
                    });
            }
        }
        setDataIsTransfering(false);
        handleChangeVendor(
            vendor,
            vendorname,
            designid,
            designcolor,
            collection,
            true
        );
        // document.querySelector("[data-bs-dismiss]").click();
    };
    useEffect(() => {
        const fetchInitPage = async () => {
            setIsLoading(true);
            setHasImageToTransfer(false);
            // setImageData([]);
            await axios({
                method: "GET",
                url: URL,
                params: {
                    search: collection,
                    designid: designid,
                    designcolor: designcolor,
                    action: "GETSHAPEFROMDESIGN",
                },
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((d) => {
                    setShapes(d.data);
                    setHasError(false);
                    setHasErrorImages(false);
                    setShapeSelected([]);
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
    }, [collection, designid, designcolor]);

    if (isLoading)
        return (
            <div className="w-100 py-2 text-center">
                <Loading cover />
            </div>
        );
    if (hasError)
        return (
            <div className="w-100 py-2 text-center">
                <div className="text-danger">
                    <p>{errorMessage}</p>
                </div>
            </div>
        );

    return (
        <>
            <div
                className="border-bottom px-4 py-2 bg-light mb-3"
                style={{ margin: "-16px -15px 0 -15px" }}
            >
                <div className="d-flex justify-content-between align-items-center">
                    <p className="flex-fill text-center text-secondary p-0 m-0 border-end">
                        DesignID: {designid}
                    </p>
                    <p className="flex-fill text-center text-secondary p-0 m-0 border-end">
                        Color: {designcolor}
                    </p>
                    <p className="flex-fill text-center text-secondary p-0 m-0">
                        Collection: {collection}
                    </p>
                </div>
            </div>
            <ul className="nav nav-pills mb-0" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link py-2 px-4 rounded-1 ${
                            activeTab === "direct-import"
                                ? "active bg-info"
                                : "text-secondary"
                        }`}
                        id="direct-import-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#direct-import"
                        type="button"
                        role="tab"
                        aria-controls="direct-import"
                        aria-selected="true"
                        onClick={(e) =>
                            setActiveTab(e.target.getAttribute("aria-controls"))
                        }
                    >
                        Direct Import
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link py-2 px-4 rounded-1 ${
                            activeTab === "import-from-link"
                                ? "active bg-info"
                                : "text-secondary"
                        }`}
                        id="import-from-link-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#import-from-link"
                        type="button"
                        role="tab"
                        aria-controls="import-from-link"
                        aria-selected="false"
                        onClick={(e) =>
                            setActiveTab(e.target.getAttribute("aria-controls"))
                        }
                    >
                        Import from Link
                    </button>
                </li>
                {/* <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link py-2 px-4 rounded-1 ${
                            activeTab === "transfer-imported"
                                ? "active bg-info"
                                : "text-secondary"
                        }`}
                        id="transfer-imported-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#transfer-imported"
                        type="button"
                        role="tab"
                        aria-controls="transfer-imported"
                        aria-selected="false"
                        onClick={(e) =>
                            setActiveTab(e.target.getAttribute("aria-controls"))
                        }
                    >
                        Transfer Imported
                    </button>
                </li> */}
            </ul>
            <div
                className="tab-content pt-3 mt-3 border-top"
                id="pills-tabContent"
            >
                <div
                    className={`tab-pane fade ${
                        activeTab === "direct-import" ? "show active" : ""
                    }`}
                    id="direct-import"
                    role="tabpanel"
                    aria-labelledby="direct-import-tab"
                    tabIndex="0"
                >
                    <div className={`px-3 py-2`}>
                        {dataIsTransfering && (
                            <div
                                className={`d-flex justify-content-center align-items-center ${styles.coverloading}`}
                            >
                                <Loading cover />
                            </div>
                        )}

                        {/* <p className="p-0 m-0">
                            <small>Color: {designcolor}</small>
                        </p> */}

                        <div className="row">
                            <div className="col-3">
                                <p className="p-0 m-0 mb-1">
                                    <small>Fetch by SKU:</small>
                                </p>
                                <div className="d-block mb-3">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        onChange={handleSelectedShapes}
                                        id="searchSkuInputRef"
                                    />
                                </div>
                                <p className="p-0 m-0 mb-3">
                                    <small>Or Choose Shape:</small>
                                </p>
                                <div className="d-flex justify-content-start align-items-start flex-column gap-2">
                                    {shapes.map((shape) => (
                                        <div
                                            className="form-check cursor-pointer"
                                            key={shape.id}
                                        >
                                            <input
                                                className="form-check-input cursor-pointer shapeinput"
                                                type="checkbox"
                                                id={shape.id}
                                                onChange={handleSelectedShapes}
                                                value={shape.sku}
                                                data-sku={shape.sku}
                                            />
                                            <label
                                                className="form-check-label cursor-pointer user-select-none"
                                                htmlFor={shape.id}
                                            >
                                                {shape.shape}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-9">
                                <div className="ps-5 border-start h-100">
                                    {isLoadingImages && <Loading cover />}
                                    {!isLoadingImages && (
                                        <>
                                            <div className="d-flex justify-content-between align-items-end">
                                                <span>
                                                    <button
                                                        disabled={
                                                            shapeSelected.length <=
                                                            0
                                                        }
                                                        className="btn btn-outline-primary rounded-1 pe-5"
                                                        onClick={
                                                            fetchImageImages
                                                        }
                                                    >
                                                        <FiDownloadCloud />
                                                        <span className="ms-2">
                                                            Fetch Images
                                                        </span>
                                                    </button>
                                                    {!hasErrorImages &&
                                                        shapeSelected.length <=
                                                            0 && (
                                                            <p className="text-muted mt-2">
                                                                <small>
                                                                    Select at
                                                                    least one
                                                                    shape to
                                                                    fetch
                                                                    images.
                                                                </small>
                                                            </p>
                                                        )}
                                                </span>
                                                {!hasErrorImages &&
                                                    shapeSelected.length ===
                                                        1 &&
                                                    skuCollection && (
                                                        <div className="d-block">
                                                            <select
                                                                className="form-control mt-2"
                                                                style={{
                                                                    width: 183,
                                                                }}
                                                                defaultValue={
                                                                    shapeSelected[0]
                                                                }
                                                                onChange={
                                                                    handleSkuCollectionChange
                                                                }
                                                            >
                                                                {skuCollection.map(
                                                                    (
                                                                        skuItem
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                skuItem
                                                                            }
                                                                            value={
                                                                                skuItem
                                                                            }
                                                                        >
                                                                            {
                                                                                skuItem
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        </div>
                                                    )}
                                            </div>

                                            {hasErrorImages && (
                                                <p className="text-danger mt-2">
                                                    <small>
                                                        {errorMessage}
                                                    </small>
                                                </p>
                                            )}
                                            {hasErrorTransferingImages && (
                                                <p className="text-danger my-2">
                                                    <small>
                                                        {errorMessage}
                                                    </small>
                                                </p>
                                            )}

                                            {!hasErrorImages && imageData && (
                                                <div className="mt-3">
                                                    {imageData.data === 0 && (
                                                        <p className="text-success">
                                                            The fetch processed
                                                            successfully but
                                                            found no image to
                                                            return.
                                                        </p>
                                                    )}

                                                    {imageData.data > 0 && (
                                                        <>
                                                            <div className="d-block border-bottom pb-2 mb-4">
                                                                <small>
                                                                    {
                                                                        imageData.data
                                                                    }{" "}
                                                                    image found.
                                                                </small>
                                                            </div>

                                                            <div className="d-flex flex-wrap justify-content-start gap-2">
                                                                {imageData.images
                                                                    .sort(
                                                                        (
                                                                            a,
                                                                            b
                                                                        ) => {
                                                                            return (
                                                                                a.shape.toUpperCase() -
                                                                                b.shape.toUpperCase()
                                                                            );
                                                                        }
                                                                    )
                                                                    .map(
                                                                        (
                                                                            image,
                                                                            index
                                                                        ) => (
                                                                            <ImportMissingImagesImage
                                                                                key={
                                                                                    index
                                                                                }
                                                                                image={
                                                                                    image
                                                                                }
                                                                                handleSelectedImages={() =>
                                                                                    handleSelectedImages(
                                                                                        index
                                                                                    )
                                                                                }
                                                                                refetch={
                                                                                    refetch
                                                                                }
                                                                            />
                                                                        )
                                                                    )}
                                                            </div>
                                                        </>
                                                    )}

                                                    {imageData.data > 0 && (
                                                        <div className="d-block mt-5 pt-5 mb-4 border-top d-flex justify-content-end gap-3">
                                                            <button
                                                                disabled={
                                                                    !hasImageToTransfer ||
                                                                    dataIsTransfering
                                                                }
                                                                className={`btn d-flex gap-3 align-items-center ${
                                                                    !hasImageToTransfer
                                                                        ? "btn-outline-secondary"
                                                                        : "btn-outline-success"
                                                                }`}
                                                                onClick={() =>
                                                                    handleTransferImages(
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                <FiDownload />
                                                                <span>
                                                                    {dataIsTransfering
                                                                        ? "Downloading, Please Wait..."
                                                                        : "Download Images No Shape"}
                                                                </span>
                                                            </button>

                                                            <button
                                                                disabled={
                                                                    !hasImageToTransfer ||
                                                                    dataIsTransfering
                                                                }
                                                                className={`btn d-flex gap-3 align-items-center ${
                                                                    !hasImageToTransfer
                                                                        ? "btn-outline-secondary"
                                                                        : "btn-outline-success"
                                                                }`}
                                                                onClick={() =>
                                                                    handleTransferImages(
                                                                        true
                                                                    )
                                                                }
                                                            >
                                                                <FiDownload />
                                                                <span>
                                                                    {dataIsTransfering
                                                                        ? "Downloading, Please Wait..."
                                                                        : "Download Images With Shape"}
                                                                </span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={`tab-pane fade ${
                        activeTab === "import-from-link" ? "show active" : ""
                    }`}
                    id="import-from-link"
                    role="tabpanel"
                    aria-labelledby="import-from-link-tab"
                    tabIndex="0"
                >
                    <div className={`px-3 py-2`}>
                        <ImportMissingImageFromLink
                            vendor={vendor}
                            vendorname={vendorname}
                            collection={collection}
                            designid={designid}
                            designcolor={designcolor}
                            imageRecordUrl={IMAGE_RECORD_URL}
                            handleChangeVendor={handleChangeVendor}
                        />
                    </div>
                </div>
                {/* <div
                    className={`tab-pane fade ${
                        activeTab === "transfer-imported" ? "show active" : ""
                    }`}
                    id="transfer-imported"
                    role="tabpanel"
                    aria-labelledby="transfer-imported-tab"
                    tabIndex="0"
                >
                    <div className={`px-3 py-2`}>
                        <ImportMissingImagesTransfer
                            vendor={vendor}
                            vendorname={vendorname}
                            collection={collection}
                            designid={designid}
                            designcolor={designcolor}
                            handleChangeVendor={handleChangeVendor}
                        />
                    </div>
                </div> */}
            </div>
        </>
    );
}

export default ImportMissingImages;
