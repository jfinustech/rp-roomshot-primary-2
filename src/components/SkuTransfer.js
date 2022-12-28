import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Loading from "./Loading";
import styles from "../styles/modules/skuTransfer.module.scss";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import SkuTransferItems from "./SkuTransferItems";
import debounce from "lodash.debounce";
import { SuggestCollectionName } from "../aux/SuggestCollectionName";
import Processor from "./dataprocess/Processor";
import ReactDOM from "react-dom/client";
import MainContextProvider from "./MainContext";
const VENDORLIST_URL = "https://sandbx.rugpal.com/office/jay/v2/designs.asp";

function SkuTransfer({
    data: { vendor, vendorname, designid, designcolor },
    reloadInitPage,
}) {
    const [vendorListOptions, setVendorListOptions] = useState([]);
    const [transferToVendor, setTransferToVendor] = useState();
    const [transferOptions, setTransferOptions] = useState([]);
    const [transferOptionsDetails, setTransferOptionsDetails] = useState([]);
    const [transferOptionLoading, setTransferOptionLoading] = useState(false);
    const [vendorLoading, setVendorLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [hasVendorError, setHasVendorError] = useState(false);
    const [errorMessageVendor, setErrorMessageVendor] = useState("");
    const [renderItems, setRenderItems] = useState();
    const [colNameExist, setColNameExist] = useState(0);
    const [toggleSizeImages, setToggleSizeImages] = useState(
        localStorage.getItem("toggleImage")
            ? parseInt(localStorage.getItem("toggleImage"))
            : 0
    );
    const [suggestionLoading, setSuggestionLoading] = useState(false);
    const [reloadTransferToVendorTab, setReloadTransferToVendorTab] =
        useState();

    const headerRef = useRef();
    const newColNameRef = useRef();
    const newDescriptionRef = useRef();

    const checkHeaderPosition = (elem) => {
        if (elem.current) {
            const bounding = elem.current.getBoundingClientRect();
            const modal = document.querySelector(".modal");
            const width = elem.current.offsetWidth;
            const height = document.querySelector("#topheader").offsetHeight;
            const divExist = document.getElementById("containerfix");
            const elemCopy = elem.current.cloneNode(true);
            elemCopy.querySelector(".form-switch").remove();
            elemCopy.setAttribute(
                "style",
                `width: ${width}px; height: ${height}px;`
            );
            elemCopy.classList.add("bg-primary");
            elemCopy.classList.add("align-items-center");
            elemCopy.classList.add("text-white");
            elemCopy.classList.remove("border-bottom");
            elemCopy.classList.remove("border-top");

            const inview =
                bounding.top >= 0 &&
                bounding.left >= 0 &&
                bounding.right <=
                    (window.innerWidth ||
                        document.documentElement.clientWidth) &&
                bounding.bottom <=
                    (window.innerHeight ||
                        document.documentElement.clientHeight);

            if (!inview) {
                if (!divExist) {
                    const div = document.createElement("div");
                    div.id = "containerfix";
                    div.classList = "d-flex justify-content-center";
                    div.setAttribute(
                        "style",
                        "position: fixed; top: 0; left: 0; width: 100%; z-index: 111"
                    );
                    elemCopy.style.width = width;
                    div.append(elemCopy);
                    modal.appendChild(div);
                }
            } else {
                if (divExist) divExist.remove();
            }
        }
    };

    const handleEntireCollection = (e) => {
        const options = document.querySelectorAll(".specificoption");
        options.forEach((element) => {
            element.disabled = e.target.checked;
        });
    };

    const handleSelection = (e, option) => {
        const did =
            e?.target?.dataset?.did ?? e?.dataset?.did ?? option?.did ?? null;
        const color =
            e?.target?.dataset?.color ??
            e?.dataset?.color ??
            option?.color ??
            null;
        const shape =
            e?.target?.dataset?.shape ??
            e?.dataset?.shape ??
            option?.shape ??
            null;
        const size =
            e?.target?.dataset?.size ??
            e?.dataset?.size ??
            option?.size ??
            null;
        const act =
            e?.target?.dataset?.act ?? e?.dataset?.act ?? option?.act ?? null;
        const checked =
            e?.target?.checked ?? e?.checked ?? option?.checked ?? false;

        // console.log(did, color, shape, size, act, checked);

        if (did === null) return;

        const transferOptionsCopy = transferOptions;

        const updatedOptions = transferOptionsCopy.designoptions.map((dopt) => {
            if (dopt.design === did) {
                const designCopy = dopt;

                switch (act) {
                    case "design":
                        if (designCopy.readonly) break;
                        designCopy.selected = checked ? 1 : 0;
                        //If unchecked, remove all checked colors and sizes
                        if (!checked) {
                            dopt.colors.map((c) => (c.selected = 0));
                            dopt.shapes.map((s) => {
                                s.sizes.map((z) => (z.selected = 0));
                                return (s.selected = 0);
                            });
                        }
                        break;
                    case "color":
                        designCopy.colors.map((c) => {
                            if (c.color === color) {
                                if (!c.readonly) c.selected = checked ? 1 : 0;
                            }
                            return c;
                        });

                        const totalSelectedColor = designCopy.colors.filter(
                            (e) => e.selected === 1
                        ).length;
                        if (totalSelectedColor <= 0) {
                            handleSelection(null, {
                                did: designCopy.design,
                                act: "design",
                                checked: false,
                            });
                        } else {
                            if (designCopy.selected === 0) {
                                handleSelection(null, {
                                    did: designCopy.design,
                                    act: "design",
                                    checked: true,
                                });
                            }
                        }
                        break;

                    case "size":
                        designCopy.shapes.map((s) => {
                            if (s.shape === shape) {
                                if (!s.readonly) s.selected = checked ? 1 : 0;

                                s.sizes.map((z) => {
                                    if (z.size === size) {
                                        if (!z.readonly)
                                            z.selected = checked ? 1 : 0;
                                    }
                                    return z;
                                });
                            }

                            const totalSelectedColor = designCopy.colors.filter(
                                (e) => e.selected === 1
                            ).length;
                            if (totalSelectedColor <= 0) {
                                handleSelection(null, {
                                    did: designCopy.design,
                                    color: designCopy.colors[0].color,
                                    act: "color",
                                    checked: true,
                                });
                            }
                            return s;
                        });

                        break;

                    default:
                        const a = "b";
                        break;
                }
            }

            return dopt;
        });

        transferOptionsCopy.designoptions = updatedOptions;

        setTransferOptions(transferOptionsCopy);
        setRenderItems(Math.random());
    };

    useEffect(() => {
        const controller = new AbortController();

        const fetchOptionDetail = async (vnd, did, clr, newVnd) => {
            setTransferOptionLoading(true);
            setHasError(false);
            setErrorMessage("");

            await axios({
                method: "GET",
                url: VENDORLIST_URL,
                params: {
                    vendor: vnd,
                    designid: did,
                    designcolor: clr,
                    search: newVnd,
                    action: "GETTRANSFERDATA",
                },
                headers: {
                    "Content-Type": "application/json",
                },
                signal: controller.signal,
            })
                .then((d) => {
                    if (d.data) {
                        setTransferOptions(d.data[0]);
                        const initdid = d.data[0].initdesign;
                        const innitoptions = d.data[0].designoptions.filter(
                            (f) => f.design === initdid
                        );
                        setTransferOptionsDetails(innitoptions);
                    }
                    setTransferOptionLoading(false);
                })
                .catch((er) => {
                    setTransferOptionLoading(false);
                    setHasError(true);
                    setErrorMessage(er.message);
                });
        };

        if (transferToVendor && transferToVendor > 0) {
            fetchOptionDetail(vendor, designid, designcolor, transferToVendor);

            document
                .querySelector(".modal")
                .addEventListener("scroll", () =>
                    checkHeaderPosition(headerRef)
                );
            new ResizeObserver(() => checkHeaderPosition(headerRef)).observe(
                document.querySelector(".modal-dialog")
            );
        }

        return () => {
            document
                .querySelector(".modal")
                .removeEventListener("scroll", () =>
                    checkHeaderPosition(headerRef)
                );
            controller.abort();
        };
    }, [
        vendor,
        designid,
        designcolor,
        transferToVendor,
        reloadTransferToVendorTab,
    ]);

    useEffect(() => {
        const fetchVendors = async () => {
            setVendorLoading(true);
            setHasVendorError(false);
            setErrorMessageVendor("");
            await axios({
                method: "GET",
                url: VENDORLIST_URL,
                params: {
                    action: "VENDORLISTALL",
                },
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((d) => {
                    setVendorListOptions(d.data);
                    setVendorLoading(false);
                })
                .catch((er) => {
                    console.log(er.message);
                    setVendorLoading(false);
                    setHasVendorError(true);
                    setErrorMessageVendor(er.message);
                });
        };

        fetchVendors();
    }, []);

    const transferData = () => {
        if (!transferOptions || Object.keys(transferOptions).length <= 0)
            return;

        // [
        //  {
        //     design: 12315665,
        //     color: "red",
        //     shape: "Rectangle",
        //     sizes: "2x3",
        //     action: "item"
        //  } ,
        //  {
        //     design: 12315665,
        //     color: "red",
        //     shape: "Rectangle",
        //     sizes: "2x3",
        //     action: "item"
        //  }
        // ]

        const org_coll = transferOptions.originalCollectionName;
        const new_coll = transferOptions.newCollectionName;
        const org_desc = transferOptions.collectionReadonly;
        const new_desc = transferOptions.originalDescription;

        if (
            org_coll === "" ||
            new_coll === "" ||
            org_desc === "" ||
            new_desc === "" ||
            org_coll === null ||
            new_coll === null ||
            org_desc === null ||
            new_desc === null
        ) {
            return alert("Missing collection name or description.");
        }

        const readyItems = [];

        transferOptions?.designoptions.reduce((didCollection, did) => {
            if (!did.selected) return didCollection;
            did.colors.reduce((colorCollection, color) => {
                if (!color.selected) return colorCollection;

                let color_readonly = color.readonly;

                did.shapes.reduce((shapeCollection, shape) => {
                    if (!shape.selected) return shapeCollection;

                    shape.sizes.reduce((sizeCollection, size) => {
                        if (!size.selected) return sizeCollection;
                        // if (all_readonly) return sizeCollection;
                        if (color_readonly) {
                            console.log("readonly", color.color);
                            if (size.readonly) return sizeCollection;
                        }

                        shapeCollection.push({
                            fromVendorId: vendor,
                            toVendorId: transferToVendor,
                            originalCollectionName:
                                transferOptions.originalCollectionName,
                            newCollectionName:
                                transferOptions.newCollectionName,
                            originalDescription:
                                transferOptions.originalDescription,
                            newDescription: transferOptions.newDescription,
                            shape: shape.shape,
                            designid: did.design,
                            originalColor: color.color,
                            newColor:
                                color.rugpalcolor &&
                                parseInt(transferToVendor) === 7600
                                    ? color.rugpalcolor
                                    : color.color,
                            size: size.size,
                            width: size.wft,
                            length: size.hft,
                            action: "CREATEITEM",
                        });

                        return sizeCollection;
                    }, didCollection);

                    return shapeCollection;
                }, didCollection);

                return colorCollection;
            }, didCollection);

            return didCollection;
        }, readyItems);

        const readyRoomshots = [];

        transferOptions?.designoptions.reduce((didCollection, did) => {
            if (!did.selected) return didCollection;

            did.colors.reduce((colorCollection, color) => {
                if (!color.selected) return colorCollection;
                colorCollection.push({
                    designid: did.design,
                    color: color.color,
                });

                return colorCollection;
            }, didCollection);

            return didCollection;
        }, readyRoomshots);

        if (
            !readyItems ||
            readyItems.length <= 0 ||
            !readyRoomshots ||
            readyRoomshots.length <= 0
        )
            return alert(
                "No item selected. Make sure to select design, color, and sizes."
            );

        recordNewData(readyItems);
        // console.table(readyItems);
        // console.table(readyRoomshots);
    };

    const recordNewData = async (data) => {
        if (document.getElementById("processor"))
            return alert(
                "There are some SKUs still processing. Please wait until they are done."
            );

        const div = document.createElement("div");
        div.id = "processor";
        document.body.appendChild(div);
        const container = document.getElementById("processor");
        const root = ReactDOM.createRoot(container);
        root.render(
            <MainContextProvider>
                <Processor
                    dataBlob={data}
                    reloadInitPage={reloadInitPage}
                    setReloadTransferToVendorTab={setReloadTransferToVendorTab}
                />
            </MainContextProvider>
        );
    };

    const handleTranslation = (e, type, suggestedValue = null) => {
        let value = suggestedValue ?? e.target.value;
        const transferOptionsCopy = transferOptions;
        let collectionNameExist = false;

        if (type === "collection") {
            //Check if the collection name is already exist:

            if (value !== "") {
                const collnameCheck = async () => {
                    const controller = new AbortController();
                    await axios({
                        method: "GET",
                        url: VENDORLIST_URL,
                        params: {
                            action: "GETCOLLECTIONNAMES",
                            search: value,
                        },
                        headers: {
                            "Content-Type": "application/json",
                        },
                        signal: controller.signal,
                    })
                        .then((d) => {
                            collectionNameExist = d.data[0].response;
                            setColNameExist(collectionNameExist);

                            if (collectionNameExist) value = null;
                        })
                        .catch((er) => {
                            console.log(er.message);
                        });
                };

                if (suggestedValue === null) collnameCheck();
            } else {
                value = null;
                setColNameExist(false);
            }

            transferOptionsCopy.newCollectionName = value;
        } else if (type === "description") {
            transferOptionsCopy.newDescription = value;
        }

        setTransferOptions(transferOptionsCopy);
        setRenderItems(Math.random());
    };

    const handleSuggestCollection = async () => {
        setSuggestionLoading(true);
        await SuggestCollectionName()
            .then((d) => {
                setSuggestionLoading(false);
                newColNameRef.current.value = d.data[0].collection;
                newDescriptionRef.current.value = d.data[0].description;

                handleTranslation(null, "collection", d.data[0].collection);
                handleTranslation(null, "description", d.data[0].description);
            })
            .catch((er) => {
                setSuggestionLoading(false);
                console.log(er);
            });
    };

    const handleFilter = (e) => {
        const value = e.target.value;

        if (!value) {
            setTransferOptionsDetails(transferOptions.designoptions);
            return;
        }

        const newTransferOptions = transferOptions.designoptions.filter(
            (e) => e.design === value
        );
        setTransferOptionsDetails(newTransferOptions);
    };

    const handleTranslationDebounce = debounce(handleTranslation, 300);

    if (vendorLoading && Object.keys(transferOptions).length <= 0)
        return (
            <div
                className={`p-3 d-flex justify-content-center align-items-center ${styles.skuTransferWrapper}`}
            >
                <Loading />
            </div>
        );

    if (hasVendorError)
        return (
            <div className={`${styles.skuTransferWrapper}`}>
                <div className="p-3 border border-danger mt-3 rounded-1 text-danger">
                    Error: {errorMessageVendor}. Try again.
                </div>
            </div>
        );
    return (
        <div className={`px-3 py-2 ${styles.skuTransferWrapper}`}>
            <div className="row">
                <div className="col-12">
                    <label
                        htmlFor="vndoption"
                        className="form-label form-label-sm"
                    >
                        Which Vendor to Transfer To:
                    </label>

                    <div className="d-flex justify-content-center align-items-center gap-2">
                        {vendorListOptions
                            ?.filter((e) => e.id !== vendor)
                            .map((vnd) => (
                                <label
                                    key={vnd.id}
                                    htmlFor={vnd.id}
                                    className={`btn flex-1 flex-grow-1 flex-shrink-0 border rounded-1 ${
                                        styles.vendorRadioChecked
                                    } ${
                                        parseInt(vnd.id) === parseInt(vendor)
                                            ? styles.disabled + " disabled"
                                            : ""
                                    }`}
                                    onClick={(e) => setTransferToVendor(vnd.id)}
                                >
                                    <span className="py-1 d-block text-center d-flex justify-content-center align-items-center">
                                        <FiCheck
                                            className={`me-2 ${styles.iconCheckMark}`}
                                        />
                                        <FiArrowRight
                                            className={`me-2 ${styles.iconArrow}`}
                                        />
                                        {vnd.name}
                                    </span>
                                    <input
                                        type="radio"
                                        name="vendorselect"
                                        id={vnd.id}
                                    />
                                </label>
                            ))}
                    </div>

                    {hasError && (
                        <div className="p-3 border border-danger mt-3 rounded-1 text-danger">
                            Error: {errorMessage}. Try again.
                        </div>
                    )}

                    {!hasError &&
                        transferToVendor > 0 &&
                        transferOptionLoading && (
                            <div
                                className={`py-3 d-flex justify-content-center align-items-center`}
                            >
                                <Loading />
                            </div>
                        )}
                    {!hasError &&
                        transferToVendor > 0 &&
                        !transferOptionLoading &&
                        transferOptions && (
                            <div className="py-3">
                                <div className="row">
                                    <div className="col-12 py-3">
                                        <div className="divider text-uppercase text-primary">
                                            Translation
                                        </div>
                                    </div>
                                    <div className="col-6 mb-2">
                                        <label className="mb-1 form-label-sm">
                                            Original Collection Name
                                        </label>
                                        <input
                                            type="text"
                                            name="ocoll"
                                            defaultValue={
                                                transferOptions.originalCollectionName
                                            }
                                            readOnly
                                            className="form-control form-control-sm"
                                        />
                                    </div>
                                    <div className="col-6 mb-2">
                                        <label className="mb-1 form-label-sm d-flex justify-content-between align-items-center">
                                            <span>
                                                New Collection
                                                {!transferOptions.collectionReadonly &&
                                                    !transferOptions.descriptionReadonly && (
                                                        <span className="cursor-pointer text-primary ps-3 ms-3 border-start">
                                                            {suggestionLoading ? (
                                                                <span>...</span>
                                                            ) : (
                                                                <span
                                                                    onClick={
                                                                        handleSuggestCollection
                                                                    }
                                                                >
                                                                    Suggest
                                                                </span>
                                                            )}
                                                        </span>
                                                    )}
                                            </span>
                                            {colNameExist > 0 && (
                                                <span className="text-danger">
                                                    Name already exist.
                                                </span>
                                            )}
                                        </label>
                                        <input
                                            ref={newColNameRef}
                                            type="text"
                                            name="ocoll"
                                            defaultValue={
                                                transferOptions.newCollectionName
                                            }
                                            readOnly={
                                                transferOptions.collectionReadonly
                                            }
                                            className={`form-control form-control-sm ${
                                                colNameExist
                                                    ? "border-danger"
                                                    : ""
                                            }`}
                                            onChange={(e) =>
                                                handleTranslationDebounce(
                                                    e,
                                                    "collection"
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="col-6 mb-2">
                                        <label className="mb-1 form-label-sm">
                                            Original Description
                                        </label>
                                        <textarea
                                            className="form-control form-control-sm"
                                            rows="8"
                                            defaultValue={
                                                transferOptions.originalDescription
                                            }
                                            readOnly
                                        ></textarea>
                                    </div>
                                    <div className="col-6 mb-2">
                                        <label className="mb-1 form-label-sm">
                                            New Description
                                        </label>
                                        <textarea
                                            ref={newDescriptionRef}
                                            className="form-control form-control-sm"
                                            rows="8"
                                            defaultValue={
                                                transferOptions.newDescription
                                            }
                                            readOnly={
                                                transferOptions.descriptionReadonly
                                            }
                                            onChange={(e) =>
                                                handleTranslationDebounce(
                                                    e,
                                                    "description"
                                                )
                                            }
                                        ></textarea>
                                    </div>
                                    <div className="col-12 py-3">
                                        <div className="divider text-uppercase text-primary">
                                            Options
                                        </div>
                                    </div>
                                    <div className="col-12 mb-3">
                                        <select
                                            name=""
                                            id=""
                                            className="form-control form-control-sm"
                                            onChange={handleFilter}
                                            defaultValue={
                                                transferOptions?.initdesign
                                            }
                                        >
                                            <option value="">
                                                --Show All--
                                            </option>
                                            {transferOptions?.filters?.map(
                                                (f) => (
                                                    <option
                                                        key={f.id}
                                                        value={f.design}
                                                    >
                                                        {f.design}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <div
                                            className="row mb-3 py-2 px-4 p-0 border-bottom border-top"
                                            ref={headerRef}
                                            style={{
                                                marginLeft: "-2rem",
                                                marginRight: "-2rem",
                                            }}
                                        >
                                            <div className="col-3">
                                                <label className="form-label-sm d-block fw-bold">
                                                    Design
                                                </label>
                                            </div>
                                            <div className="col-3">
                                                <label className="form-label-sm d-block fw-bold">
                                                    Color
                                                </label>
                                            </div>
                                            <div className="col-6">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <label className="form-label-sm d-block fw-bold">
                                                        Size
                                                    </label>
                                                    <div>
                                                        <div className="form-check form-switch d-flex align-items-center gap-2">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                role="switch"
                                                                id="showImagePopUps"
                                                                checked={
                                                                    toggleSizeImages
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    localStorage.setItem(
                                                                        "toggleImage",
                                                                        e.target
                                                                            .checked
                                                                            ? 1
                                                                            : 0
                                                                    );
                                                                    setToggleSizeImages(
                                                                        e.target
                                                                            .checked
                                                                            ? true
                                                                            : false
                                                                    );
                                                                }}
                                                            />
                                                            <label
                                                                className="form-check-label form-label-sm"
                                                                htmlFor="showImagePopUps"
                                                            >
                                                                Image Popup
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* {transferOptions.designoptions?.map( */}
                                        {transferOptionsDetails?.map((did) => (
                                            <SkuTransferItems
                                                key={did.design}
                                                did={did}
                                                handleSelection={
                                                    handleSelection
                                                }
                                                toggleSizeImages={
                                                    toggleSizeImages
                                                }
                                                transferToVendor={
                                                    transferToVendor
                                                }
                                                render={renderItems}
                                            />
                                        ))}

                                        <div className="d-bloc pt-4 text-end">
                                            <button
                                                className="btn btn-outline-danger rounded-1"
                                                onClick={transferData}
                                            >
                                                Transfer SKUs
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}

export default SkuTransfer;
