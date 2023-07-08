import { useState, useEffect } from "react";
import { ImagePup } from "../../aux/ImagePup";
import ListItems from "./ListItems";
import axios from "axios";
import { loadingRaw } from "../Loading";
import ColorOptions from "./ColorOptions";
import { initLoadingElement, removeLoadingElement } from "../LoadingElement";
import ListStyles from "./ListStyles";

const VIEW_URL = "https://sandbx.rugpal.com/office/jay/v2/designs.asp";

const AddExtraColorAndDesigns = ({
    data: {
        vendor,
        vendorname,
        collection,
        designid,
        designcolor,
        vendorItemCount,
        images,
    },
    handleChangeVendor,
}) => {
    const [imageList, setImageList] = useState([]);
    const [preDefinedColors] = useState([
        "Beige",
        "Black",
        "Blue",
        "Brown",
        "Clear",
        "Cream",
        "Gold",
        "Green",
        "Grey",
        "Ivory",
        "Multi",
        "Off-White",
        "Orange",
        "Pink",
        "Purple",
        "Red",
        "Silver",
        "Tan",
        "Taupe",
        "White",
        "Yellow",
    ]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageData, setPageData] = useState([]);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [optionSelected, setOptionSelected] = useState([]);
    const [showStyleTab, setShowStyleTab] = useState(false);
    const [preDefinedStyles] = useState([
        "Americana",
        "Bohemian & Eclectic",
        "Cabin & Lodge",
        "Casual",
        "Classic",
        "Colonial",
        "Country",
        "Farmhouse",
        "French Country",
        "Glam",
        "Global",
        "Industrial",
        "Kids & Tween",
        "Mid-Century Modern",
        "Mission & Craftsman",
        "Modern & Contemporary",
        "Moroccan",
        "Nautical & Coastal",
        "Novelty",
        "Patterned",
        "Persian",
        "Rag Rug",
        "Rustic",
        "Scandinavian",
        "Shabby Chic",
        "Shag",
        "Southwestern",
        "Traditional",
        "Transitional",
        "Tropical",
        "Vintage",
    ]);

    const makeChange = async (action, value) => {
        if (!action || isNaN(action) || typeof action === "undefined") {
            return alert("Invalid action ID.");
        }

        if (!value || value === "" || typeof value === "undefined") {
            return alert("Invalid value provided.");
        }

        // setIsLoading(true);

        await axios({
            method: "GET",
            url: VIEW_URL,
            params: {
                page_offset: action, //Action index number passed as page_offest to the SP
                designid: designid,
                designcolor: designcolor,
                search: value, //Actual value passed as search param to the SP
                action: "EDITCOLORANDSTYLEOPTION",
            },
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((d) => {
                setPageData(d.data[0]);

                if (
                    d.data[0].options_selected !== null &&
                    d.data[0].options_selected.length > 0
                ) {
                    setOptionSelected(d.data[0].options_selected[0]);
                }
            })
            .catch((er) => {
                setHasError(true);
                setIsLoading(false);
                setErrorMessage(er.message);
            });
    };

    const callChanges = async (action, value) => {
        initLoadingElement(true);

        await makeChange(action, value).then(() => {
            removeLoadingElement();
        });
    };

    useEffect(() => {
        const fetch = async () => {
            await axios({
                method: "GET",
                url: VIEW_URL,
                params: {
                    designid: designid,
                    designcolor: designcolor,
                    action: "GETCOLORANDSTYLEOPTION",
                },
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((d) => {
                    setIsLoading(false);
                    setPageData(d.data[0]);

                    if (
                        d.data[0].options_selected !== null &&
                        d.data[0].options_selected.length > 0
                    ) {
                        setOptionSelected(d.data[0].options_selected[0]);
                    }
                })
                .catch((er) => {
                    setHasError(true);
                    setIsLoading(false);
                    setErrorMessage(er.message);
                });
        };

        fetch();

        const imgArray = [];
        if (images) {
            for (let image of images) {
                imgArray.push(image.src);
            }
        }
        setImageList(imgArray);
    }, [images, designid, designcolor]);

    return (
        <>
            {isLoading && loadingRaw}
            {hasError && errorMessage}
            {!hasError && !isLoading && (
                <>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <button
                            onClick={() => setShowStyleTab(false)}
                            className={`btn ${
                                !showStyleTab
                                    ? "btn-info text-white"
                                    : "btn-outline-secondary"
                            } flex-1 flex-grow-1 flex-shrink-0 rounded-1`}
                        >
                            Colors
                        </button>
                        <button
                            onClick={() => setShowStyleTab(true)}
                            className={`btn ${
                                showStyleTab
                                    ? "btn-info text-white"
                                    : "btn-outline-secondary"
                            } flex-1 flex-grow-1 flex-shrink-0 rounded-1`}
                        >
                            Styles
                        </button>
                    </div>

                    <div className="row mt-4">
                        <div className="col-4">
                            <p className="mb-4">Sample Images:</p>
                            <div className="d-flex flex-wrap justify-content-start align-items-center gap-2">
                                {imageList &&
                                    imageList.length > 0 &&
                                    imageList.sort().map((image) => (
                                        <>
                                            <img
                                                className="border rounded rounded-1"
                                                src={image}
                                                style={{
                                                    width: "30%",
                                                    height: 100,
                                                    objectFit: "cover",
                                                    cursor: "pointer",
                                                }}
                                                alt=""
                                                onClick={(e) => ImagePup(image)}
                                            />
                                        </>
                                    ))}
                            </div>
                        </div>
                        {showStyleTab && (
                            <div className="col-7 offset-1">
                                <p className="mb-4">Styles:</p>
                                <div className="style-cat-container mb-4 pb-4 border-bottom">
                                    <ListStyles
                                        list={preDefinedStyles}
                                        inputName="style_cat_1"
                                        selectedLabel="Style. 1"
                                        selected={
                                            optionSelected.style_1 +
                                                "::" +
                                                pageData.style ?? pageData.style
                                        }
                                        readonly={false}
                                        action={7}
                                        callChanges={callChanges}
                                    />
                                </div>
                                <div className="style-cat-container mb-4 pb-4 border-bottom">
                                    <ListStyles
                                        list={preDefinedStyles}
                                        inputName="style_cat_2"
                                        selectedLabel="Style. 2"
                                        selected={optionSelected.style_2}
                                        readonly={false}
                                        action={8}
                                        callChanges={callChanges}
                                    />
                                </div>
                                <div className="style-cat-container mb-4 pb-4 border-bottom">
                                    <ListStyles
                                        list={preDefinedStyles}
                                        inputName="style_cat_3"
                                        selectedLabel="Style. 3"
                                        selected={optionSelected.style_3}
                                        readonly={false}
                                        action={9}
                                        callChanges={callChanges}
                                    />
                                </div>
                            </div>
                        )}
                        {!showStyleTab && (
                            <div className="col-7 offset-1">
                                <p className="mb-4">Attributes:</p>
                                <div className="color-cat-container mb-4 pb-4 border-bottom">
                                    <ListItems
                                        list={preDefinedColors}
                                        inputName="color_cat_1"
                                        selectedLabel="Color Cat. 1"
                                        selected={
                                            optionSelected.color_cat_1 +
                                                "::" +
                                                pageData.color_cat_name ??
                                            pageData.color_cat_name
                                        }
                                        readonly={false}
                                        action={1}
                                        callChanges={callChanges}
                                    />
                                </div>
                                <div className="color-cat-container mb-4 pb-4 border-bottom">
                                    <ListItems
                                        list={preDefinedColors}
                                        inputName="color_cat_2"
                                        selectedLabel="Color Cat. 2"
                                        selected={
                                            optionSelected.color_cat_2 ?? ""
                                        }
                                        readonly={false}
                                        action={2}
                                        callChanges={callChanges}
                                    />
                                </div>
                                <div className="color-cat-container mb-4 pb-4 border-bottom">
                                    <ListItems
                                        list={preDefinedColors}
                                        inputName={"color_cat_3"}
                                        selectedLabel="Color Cat. 3"
                                        selected={
                                            optionSelected.color_cat_3 ?? ""
                                        }
                                        readonly={false}
                                        action={3}
                                        callChanges={callChanges}
                                    />
                                </div>

                                <div className="color-name-container mb-4 pb-4 border-bottom">
                                    <label className="form-label">
                                        Color Name. 1: {pageData.designColor}
                                    </label>
                                </div>
                                <div className="color-name-container mb-4 pb-4 border-bottom">
                                    <ColorOptions
                                        list={pageData.color_options ?? null}
                                        inputName="color_name_2"
                                        selectedLabel="Color Name. 2"
                                        selected={
                                            optionSelected.color_name_2 ?? ""
                                        }
                                        readonly={false}
                                        action={5}
                                        callChanges={callChanges}
                                    />
                                </div>
                                <div className="color-name-container mb-4 pb-4 border-bottom">
                                    <ColorOptions
                                        list={pageData.color_options ?? null}
                                        inputName="color_name_3"
                                        selectedLabel="Color Name. 3"
                                        selected={
                                            optionSelected.color_name_3 ?? ""
                                        }
                                        readonly={false}
                                        action={6}
                                        callChanges={callChanges}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default AddExtraColorAndDesigns;
