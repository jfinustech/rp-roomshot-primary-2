import React from "react";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import styles from "../styles/modules/designSection.module.scss";
import DesignImageBox from "./DesignImageBox";
import DesignSectionAction from "./DesignSectionAction";
import DesignSideList from "./DesignSideList";
import Loading from "./Loading";
import { FiMaximize2 } from "react-icons/fi";
import { SetShape } from "../aux/SetShape";
import { SetPrimary } from "../aux/SetPrimary";
import { SetSoftDelete } from "../aux/SetSoftDelete";
import { SetHardDelete, SetHardDeleteBulk } from "../aux/SetHardDelete";
import { HandleModal } from "../aux/HandleModal";

const VIEW_URL = "https://sandbx.rugpal.com/office/jay/v2/designs.asp";

function DesignSection({ design }) {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [reload, setReload] = useState("");
    const sectionRef = useRef();
    const [primaryList, setPrimaryList] = useState([]);
    const [shapeList, setShapeList] = useState([]);

    const [designFilter, setDesignFilter] = useState({
        designid: design.designID,
        designcolor: design.designColor,
        vendor: design.vendorID,
        vendorname: design.vendor,
        collectionname: design.collectionName,
    });

    const handleChangeVendor = (vid, vname, did, didcolor, didcollection) => {
        if (designFilter.vendor === parseInt(vid)) return;
        const didfilter = designFilter;
        didfilter.vendor = parseInt(vid);
        didfilter.vendorname = vname;
        didfilter.designid = did;
        didfilter.designcolor = didcolor;
        didfilter.collectionname = didcollection;

        setDesignFilter(didfilter);
        setReload(Math.random());
    };

    const getPrimaryList = (items) => {
        let primaries = null;
        try {
            primaries = items.filter((e) => e.is_primary && e.show_image);
        } catch (er) {
            console.error(er);
        }
        setPrimaryList(primaries);
    };

    const getShapeList = (items) => {
        let selectedShapes = null;
        try {
            selectedShapes = items.filter(
                (e) =>
                    e.designShape !== null &&
                    e.designShape !== "" &&
                    e.show_image &&
                    !e.is_primary
            );
        } catch (er) {
            console.error(er);
        }

        setShapeList(selectedShapes);
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
        console.log("callingPrimary");

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
        const bulklist = images.filter(
            (img) =>
                !img.is_primary && img.designShape === null && img.show_image
        );

        if (bulklist.length <= 0) return;

        for (const key in bulklist) {
            await handleSoftDelete(bulklist[key]);
        }
    };

    const handleHardDelete = async (item) => {
        const fetch = SetHardDelete(item.id);

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
                className={`position-relative border mb-3 ${
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
                <div className="d-flex justify-content-start align-items-start gap-0">
                    <div
                        className={`border-end align-self-stretch d-flex align-items-start flex-column flex-shrink-0 ${styles.sideSection}`}
                    >
                        <div className="sticky sticky-top w-100">
                            <h6
                                onClick={(e) =>
                                    HandleModal(
                                        "Primary Items",
                                        "DesignSideModal",
                                        primaryList
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
                        className={`border-end align-self-stretch d-flex align-items-start flex-column flex-shrink-0 ${styles.sideSection}`}
                    >
                        <div className="sticky sticky-top w-100">
                            <h6
                                onClick={(e) =>
                                    HandleModal(
                                        "Selected Shapes",
                                        "DesignSideModal",
                                        shapeList
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
                            <div className="d-flex mb-3">
                                <div>
                                    <h3 className="p-0 m-0">
                                        {designFilter.collectionname}
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
                                        <p className="p-0 m-0 py-2">
                                            <span className="text-muted">
                                                Brand:{" "}
                                            </span>{" "}
                                            {designFilter.vendorname}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <DesignSectionAction
                                handleSoftDeleteBulk={handleSoftDeleteBulk}
                            />
                            <div className="align-self-stretch flex-grow-1 w-100 d-flex flex-wrap justify-content-start align-items-stretch gap-4">
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
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                    <div
                        className={`align-self-stretch flex-shrink-0 justify-content-start border-start ${styles.sideSectionSmall}`}
                    >
                        <div
                            className="sticky sticky-top"
                            style={{
                                height:
                                    (images[0]?.vendors?.length ?? 1) * 150 - 1,
                            }}
                        >
                            <div
                                className={`d-flex justify-content-start align-items-center ${styles.sideSectionSmallTabHolder}`}
                            >
                                {images[0]?.vendors.map((vendor) => (
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
                    </div>
                </div>
                {/* )} */}
            </section>
        </>
    );
}

export default DesignSection;
