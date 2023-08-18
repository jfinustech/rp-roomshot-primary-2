import axios from "axios";
import { useState, useEffect, useRef, useContext } from "react";
import styles from "../styles/modules/designSection.module.scss";
import DesignImageBox from "./DesignImageBox";
import DesignSectionAction from "./DesignSectionAction";
import DesignSideList from "./DesignSideList";
import Loading from "./Loading";
import { FiChevronDown, FiChevronUp, FiMaximize2 } from "react-icons/fi";
import { SetShape } from "../aux/SetShape";
import { SetPrimary } from "../aux/SetPrimary";
import { SetSoftDelete } from "../aux/SetSoftDelete";
import { SetHardDelete, SetHardDeleteBulk } from "../aux/SetHardDelete";
import { HandleModal } from "../aux/HandleModal";
import DesignVendorTabs from "./DesignVendorTabs";
import { MainContext } from "./MainContext";
import { initLoadingElement, removeLoadingElement } from "./LoadingElement";

const VIEW_URL = "https://sandbx.rugpal.com/office/jay/v2/designs.asp";

function DesignSection({ design, reloadInitPage }) {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [reload, setReload] = useState("");
    const sectionRef = useRef();
    const collapseBtnRef = useRef();
    const [primaryList, setPrimaryList] = useState([]);
    const [shapeList, setShapeList] = useState([]);

    const { galleryMode } = useContext(MainContext);

    const handleCollapseSection = (e) => {
        const isCollapsed = sectionRef.current.classList.contains(
            styles.collapsSection
        );
        const sectionsArray = document.querySelectorAll(
            ".none-module-section-wrapper"
        );

        if (isCollapsed) {
            if (e.shiftKey) {
                sectionsArray.forEach((s) => {
                    s.classList.remove(styles.collapsSection);
                });
            } else {
                sectionRef.current.classList.remove(styles.collapsSection);
            }
        } else {
            if (e.shiftKey) {
                sectionsArray.forEach((s) => {
                    s.classList.add(styles.collapsSection);
                });
            } else {
                sectionRef.current.classList.add(styles.collapsSection);
            }
        }
    };

    const [designFilter, setDesignFilter] = useState({
        designid: design.designID,
        designcolor: design.designColor,
        vendor: design.vendorID,
        vendorname: design.vendor,
        collectionname: design.collectionName,
        total_sku: design.total_sku,
    });

    const handleChangeVendor = (
        vid,
        vname,
        did,
        didcolor,
        didcollection,
        totalSku,
        force = false
    ) => {
        if (designFilter.vendor === parseInt(vid) && !force) return;
        const didfilter = designFilter;
        didfilter.vendor = parseInt(vid);
        didfilter.vendorname = vname;
        didfilter.designid = did;
        didfilter.designcolor = didcolor;
        didfilter.collectionname = didcollection;
        didfilter.total_sku = totalSku;
        setDesignFilter(didfilter);
        setReload(Math.random());
    };

    const getPrimaryList = (items) => {
        let primaries = null;
        try {
            if (items) {
                primaries = items?.filter((e) => e.is_primary && e.show_image);
                setPrimaryList(primaries);
            }
        } catch (er) {
            console.error(er);
        }
    };

    const getShapeList = (items) => {
        let selectedShapes = null;
        try {
            if (items) {
                selectedShapes = items.filter(
                    (e) =>
                        e.designShape !== null &&
                        e.designShape !== "" &&
                        e.show_image &&
                        !e.is_primary
                );
                setShapeList(selectedShapes);
            }
        } catch (er) {
            console.error(er);
        }
    };

    const handleShape = async (item, shape = null) => {
        const fetch = SetShape(item.id, shape);
        let result = null;
        await fetch
            .then((e) => (result = e[0].response))
            .catch((er) => console.log(er));
        if (result === "notexist") alert("record does not exist.");

        const newImages = images;
        newImages.map((img) =>
            img.id === item.id
                ? (img.designShape = result === "removed" ? null : shape)
                : img
        );
        setImages(newImages);
        getPrimaryList(newImages);
        getShapeList(newImages);
    };

    const handlePrimary = async (item) => {
        //console.log("callingPrimary");

        const fetch = SetPrimary(item.id);

        await fetch
            .then((e) => {
                const result = e[0].response;
                if (result === "notexist") {
                    return alert("Record does not exist.");
                }

                const newImages = images;
                newImages.map((img) =>
                    img.id === item.id
                        ? (img.is_primary = result === "removed" ? false : true)
                        : img
                );
                setImages(newImages);
                getPrimaryList(newImages);
                getShapeList(newImages);
            })
            .catch((er) => {
                return alert(
                    "An error occurred. We could not process your request at the moment."
                );
            });
    };

    const handleSoftDelete = async (item) => {
        const fetch = SetSoftDelete(item.id);

        await fetch
            .then((e) => {
                const result = e[0].response;
                if (result === "notexist") {
                    return alert("Record does not exist.");
                }

                const newImages = images;
                newImages.map((img) =>
                    img.id === item.id
                        ? (img.show_image = result === "removed" ? false : true)
                        : img
                );
                setImages(newImages);
                getPrimaryList(newImages);
                getShapeList(newImages);
            })
            .catch((er) => {
                return alert(
                    "An error occurred. We could not process your request at the moment."
                );
            });
    };

    const handleSoftDeleteBulk = async (items = images) => {
        if (items.length <= 0) return alert("No item to delete.");

        initLoadingElement();

        const bulklist = images.filter(
            (img) =>
                !img.is_primary && img.designShape === null && img.show_image
        );

        if (bulklist.length <= 0) {
            removeLoadingElement();
            return;
        }

        for (const key in bulklist) {
            await handleSoftDelete(bulklist[key]);
        }

        removeLoadingElement();
    };

    const handleHardDelete = async (item, reload = true) => {
        const fetch = SetHardDelete(item.id);

        await fetch
            .then((e) => {
                const result = e[0].response;
                if (result === "notexist") {
                    return alert("Record does not exist.");
                }

                if (reload) {
                    const newImages = images.filter(
                        (img) => parseInt(img.id) !== parseInt(item.id)
                    );

                    setImages(newImages);
                    getPrimaryList(newImages);
                    getShapeList(newImages);
                }
            })
            .catch((er) => {
                return alert(
                    "An error occurred. We could not process your request at the moment."
                );
            });
    };
    const handleHardDeleteAll = async (items = images) => {
        initLoadingElement();

        const bulklist = images;

        if (bulklist.length <= 0) {
            removeLoadingElement();
            return;
        }

        for await (const item of bulklist) {
            await handleHardDelete(item, false);
            // await console.log(item);
        }

        setImages([]);
        getPrimaryList([]);
        getShapeList([]);

        await handleChangeVendor(
            design.vendorID,
            design.vendorname,
            design.designID,
            design.designColor,
            design.collectionName,
            true
        );
        removeLoadingElement();
    };

    const handleHardDeleteBulk = async (item) => {
        const fetch = SetHardDeleteBulk(item.id);

        await fetch
            .then((e) => {
                const result = e[0].response;
                if (result === "notexist") {
                    return alert("Record does not exist.");
                }

                const newImages = images.filter(
                    (img) => parseInt(img.id) !== parseInt(item.id)
                );

                setImages(newImages);
                getPrimaryList(newImages);
                getShapeList(newImages);
            })
            .catch((er) => {
                return alert(
                    "An error occurred. We could not process your request at the moment."
                );
            });
    };

    const handleHardDeleteBulkAll = async (item) => {};

    const handleUploadResponse = (newItem) => {
        const newImages = [...newItem, ...images];
        setImages(newImages);
    };

    useEffect(() => {
        setIsLoading(true);

        const fetch = async () => {
            await axios({
                method: "GET",
                url: VIEW_URL,
                params: {
                    designid: designFilter.designid,
                    designcolor: designFilter.designcolor,
                    vendor: designFilter.vendor,
                    action: "SHOWDESIGN",
                },
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((d) => {
                    setImages(d.data);
                    setIsLoading(false);
                    getPrimaryList(d.data);
                    getShapeList(d.data);
                    if (reload)
                        sectionRef.current.scrollIntoView({
                            behavior: "smooth",
                        });
                })
                .catch((er) => {
                    setHasError(true);
                    setIsLoading(false);
                    setErrorMessage(er.message);
                });
        };

        fetch();
    }, [designFilter, reload]);

    if (hasError) return <div>{errorMessage}</div>;

    return (
        <>
            <section
                ref={sectionRef}
                className={`position-relative none-module-section-wrapper border mb-3 ${
                    (styles.designSectionWrapper, styles.designSectionMain)
                }`}
            >
                {isLoading && (
                    <div
                        className={`d-flex justify-content-center align-items-center position-absolute ${styles.sectionLoadingCover}`}
                    >
                        <Loading cover={false} />
                    </div>
                )}
                {/* {!isLoading && ( */}
                <div
                    className={`d-flex justify-content-start align-items-start gap-0`}
                    style={{ minHeight: "50vh" }}
                >
                    <div
                        className={`border-end align-self-stretch align-items-start flex-column flex-shrink-0 ${
                            styles.sideSection
                        } ${galleryMode ? "d-none" : "d-flex"}`}
                    >
                        <div className="sticky sticky-top w-100">
                            <h6
                                onClick={(e) =>
                                    HandleModal(
                                        "Primary Items",
                                        "DesignSideModal",
                                        primaryList,
                                        handlePrimary
                                    )
                                }
                                className="d-flex justify-content-between align-items-center px-3 cursor-pointer border-bottom m-0 py-2 fw-normal w-100"
                            >
                                <span>Primaries</span>
                                <small>
                                    <FiMaximize2 style={{ color: "silver" }} />
                                </small>
                            </h6>
                            <div
                                className={`d-flex flex-column noScrollBar ${styles.sideSectionInner}`}
                            >
                                <DesignSideList
                                    Items={primaryList}
                                    handleItem={handlePrimary}
                                    id="primary"
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        className={`border-end align-self-stretch align-items-start flex-column flex-shrink-0 ${
                            styles.sideSection
                        } ${galleryMode ? "d-none" : "d-flex"}`}
                    >
                        <div className="sticky sticky-top w-100">
                            <h6
                                onClick={(e) =>
                                    HandleModal(
                                        "Selected Shapes",
                                        "DesignSideModal",
                                        shapeList,
                                        handleShape
                                    )
                                }
                                className="d-flex justify-content-between align-items-center px-3 cursor-pointer border-bottom m-0 py-2 fw-normal w-100"
                            >
                                <span>Shapes</span>
                                <small>
                                    <FiMaximize2 style={{ color: "silver" }} />
                                </small>
                            </h6>
                            <div
                                className={`d-flex flex-column noScrollBar ${styles.sideSectionInner}`}
                            >
                                <DesignSideList
                                    Items={shapeList}
                                    handleItem={handleShape}
                                    id="shape"
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        className={
                            `d-flex flex-fill justify-content-start align-items-start flex-column ` +
                            styles.contentSection
                        }
                    >
                        <div className={`${styles.contentSectionInner}`}>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h3 className="p-0 m-0 d-flex justify-content-start align-items-center">
                                        {designFilter.collectionname}
                                        {design.is_rugscom && (
                                            <small
                                                className="border rounded rounded-1 text-danger ms-3 border-danger py-1 px-2 d-inline-block"
                                                style={{ fontSize: 14 }}
                                            >
                                                rugs.com
                                            </small>
                                        )}

                                        {design.is_discontinued === 0 && (
                                            <small
                                                className="border rounded rounded-1 text-danger ms-3 border-danger py-1 px-2 d-inline-block"
                                                style={{ fontSize: 14 }}
                                            >
                                                Discontinued
                                            </small>
                                        )}
                                        {design.is_discontinued > 0 && (
                                            <small
                                                className="border rounded rounded-1 text-danger ms-3 border-danger py-1 px-2 d-inline-block"
                                                style={{ fontSize: 14 }}
                                            >
                                                Discontinued With{" "}
                                                {design.is_discontinued} Total
                                                Inventory
                                            </small>
                                        )}
                                        {!design.is_discontinued && (
                                            <small
                                                className="border rounded rounded-1 text-success ms-3 border-success py-1 px-2 d-inline-block"
                                                style={{ fontSize: 14 }}
                                            >
                                                Active
                                            </small>
                                        )}
                                    </h3>
                                    <div className="d-flex justify-content-start align-items-center">
                                        <p className="p-0 m-0 py-2 pe-4 me-4 border-end">
                                            <span className="text-muted">
                                                Design ID:{" "}
                                            </span>{" "}
                                            {designFilter.designid}
                                        </p>
                                        <p className="p-0 m-0 py-2 pe-4 me-4 border-end">
                                            <span className="text-muted">
                                                Color:{" "}
                                            </span>{" "}
                                            {designFilter.designcolor}
                                        </p>
                                        <p className="p-0 m-0 py-2 pe-4 me-4 border-end">
                                            <span className="text-muted">
                                                Brand:{" "}
                                            </span>{" "}
                                            {designFilter.vendorname}
                                        </p>
                                        <p className="p-0 m-0 py-2">
                                            <span className="text-muted">
                                                Total SKU:{" "}
                                            </span>{" "}
                                            {designFilter.total_sku}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    className={`${styles.showHidePannelBtn} btn btn-outline-secondary rounded rounded-pill d-flex justify-content-center align-items-center p-0 m-0`}
                                    ref={collapseBtnRef}
                                    onClick={handleCollapseSection}
                                >
                                    <FiChevronUp
                                        className={`${styles.showHideSvgHide}`}
                                    />
                                    <FiChevronDown
                                        className={`${styles.showHideSvgShow}`}
                                    />
                                </button>
                            </div>
                            <DesignSectionAction
                                handleSoftDeleteBulk={handleSoftDeleteBulk}
                                designid={designFilter.designid}
                                designcolor={designFilter.designcolor}
                                vendor={designFilter.vendor}
                                vendorname={designFilter.vendorname}
                                collection={designFilter.collectionname}
                                handleUploadResponse={handleUploadResponse}
                                reloadInitPage={reloadInitPage}
                                handleChangeVendor={handleChangeVendor}
                                vendorItemCount={designFilter.vendor}
                            />
                            <div className="gallery_wrapper_in align-self-stretch flex-grow-1 w-100 d-flex flex-wrap justify-content-start align-items-stretch gap-2">
                                {images.length <= 0 && (
                                    <div className="d-flex justify-content-center align-items-center w-100 flex-column">
                                        <div className="border-bottom px-5">
                                            <img
                                                src={`${process.env.PUBLIC_URL}/images/nada.jpg`}
                                                alt={``}
                                                height="250"
                                            />
                                        </div>
                                        <div className="mt-3 text-center">
                                            <small className="text-muted">
                                                No image found for{" "}
                                            </small>
                                            <br />
                                            {`${design.designID} - ${design.designColor}`}
                                        </div>
                                    </div>
                                )}
                                {images.length > 0 &&
                                    images?.map((image) => (
                                        <DesignImageBox
                                            key={image.id}
                                            image={image}
                                            handleShape={handleShape}
                                            handlePrimary={handlePrimary}
                                            handleSoftDelete={handleSoftDelete}
                                            handleHardDelete={handleHardDelete}
                                            handleHardDeleteBulk={
                                                handleHardDeleteBulk
                                            }
                                            handleHardDeleteAll={
                                                handleHardDeleteAll
                                            }
                                            handleHardDeleteBulkAll={
                                                handleHardDeleteBulkAll
                                            }
                                            rerender={Math.random()}
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>

                    <DesignVendorTabs
                        images={images[0]}
                        designFilter={designFilter}
                        handleChangeVendor={handleChangeVendor}
                    />
                </div>
                {/* )} */}
            </section>
        </>
    );
}

export default DesignSection;
