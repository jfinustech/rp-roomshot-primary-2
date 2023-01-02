import { useEffect, useState } from "react";
import styles from "../styles/modules/skuTransfer.module.scss";
import { Tooltip } from "bootstrap";
import { ImagePup } from "../aux/ImagePup";
import { FiArrowDown, FiArrowRight } from "react-icons/fi";

function SkuTransferItems({
    did,
    handleSelection,
    toggleSizeImages,
    transferToVendor,
}) {
    // const [designChange, setDesignChange] = useState(did?.design ?? null);
    // const [optionChange, setoptionChange] = useState([]);
    const [didData, setDidData] = useState(did);

    const handleSelectAllSizes = (e) => {
        const inputs = e.target.nextSibling.querySelectorAll("input");
        const totalInputs = inputs.length;
        let totalInputsSelected = 0;
        inputs.forEach((element) => {
            if (element.checked) totalInputsSelected++;
        });

        const action = totalInputs === totalInputsSelected ? false : true;

        inputs.forEach((element) => {
            element.checked = action;
            handleSelection(element);
        });
    };

    const handleGroupSelect = (e) => {
        if (!e.metaKey) return;

        const groupClass = e.target.dataset.group;
        const inputChecked = !e.currentTarget.querySelector("input").checked;
        const inputGroup = document.getElementsByClassName(`${groupClass}`);

        if (inputChecked !== undefined) {
            [...inputGroup].map((inp) => {
                inp.checked = inputChecked;
                handleSelection(inp);
            });
        }

        //size-${s.size}
        // const input = e.target.querySelector("input");

        // console.log(input.checked);

        return;
        // console.log(e.metaKey);
        // if (!e.shiftKey) return;
    };

    const handleImagePopOver = (e, img) => {
        if (!toggleSizeImages) return;
        if (!img) return;
        const image = new Image();
        image.src = img;

        if (image) {
            const tooltip = new Tooltip(e.target, {
                title: `<img src='${img}'>`,
                html: true,
                placement: "top",
                customClass: "modal-inner-tooltip",
                animation: false,
                // toggle: "tooltip",
            });
            tooltip.show();
        }
    };

    useEffect(() => {
        setDidData(did);
    }, [did, handleSelection]);

    return (
        <div className="row border-bottom pb-5 mb-5 m-0 p-0">
            <div className="col-2 m-0 p-0">
                <div className={`sticky sticky-top ${styles.stickyTopMargin}`}>
                    <label
                        className={`form-check-label form-label-sm rounded-1 border ${
                            styles.checkOption
                        } ${
                            didData.readonly === 1
                                ? styles.checkOptionReadoly
                                : ""
                        }`}
                        htmlFor={didData?.id}
                    >
                        <input
                            className="form-check-input specificoption"
                            type="checkbox"
                            id={didData?.id}
                            checked={didData?.selected}
                            name="designid"
                            data-did={didData?.design}
                            data-act="design"
                            onChange={handleSelection}
                        />
                        {didData?.design}
                        <br />
                        <FiArrowDown /> <br />
                        {didData?.designto}
                    </label>
                </div>
            </div>

            <div className="col-3 m-0 p-0">
                <div className="ps-4 border-start h-100">
                    <div
                        className={`sticky sticky-top ${styles.stickyTopMargin}`}
                    >
                        {didData?.colors?.map((c) => (
                            <div key={c.id} className="mb-2">
                                <label
                                    className={`form-check-label form-label-sm rounded-1 border ${
                                        styles.checkOption
                                    } ${
                                        c.readonly === 1
                                            ? styles.checkOptionReadoly
                                            : ""
                                    }`}
                                    htmlFor={c.id}
                                >
                                    <input
                                        className="form-check-input specificoption"
                                        type="checkbox"
                                        value=""
                                        id={c.id}
                                        checked={c.selected}
                                        name="colorname"
                                        data-did={didData?.design}
                                        data-color={c.color}
                                        data-act="color"
                                        onChange={handleSelection}
                                    />
                                    {c.color} <FiArrowRight />{" "}
                                    {c.rugpalcolor !== null &&
                                    parseInt(transferToVendor) === 7600
                                        ? c.rugpalcolor
                                        : c.color}
                                </label>
                                <br />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="col-7 m-0 p-0">
                <div className="ps-4 border-start h-100">
                    {did?.shapes?.map((sh) => (
                        <div key={sh.id} className="d-block mb-2">
                            <div className="d-flex justify-content-start align-items-start gap-4">
                                <div
                                    className={`text-center flex-shrink-0 ${styles.sampleImageWrapper}`}
                                >
                                    <img
                                        src={
                                            sh.sizes[0].image ??
                                            `${process.env.PUBLIC_URL}/images/placeholder_lg.jpg`
                                        }
                                        alt=""
                                        className={`mt-4 cursor-pointer ${styles.sampleImage}`}
                                        onClick={(e) =>
                                            sh.sizes[0].image
                                                ? ImagePup(
                                                      sh.sizes[0].image,
                                                      "headshot"
                                                  )
                                                : false
                                        }
                                    />
                                </div>
                                <div>
                                    <label
                                        className="form-check-label form-label-sm mb-2 cursor-pointer user-select-none"
                                        htmlFor={sh.id}
                                        onClick={handleSelectAllSizes}
                                    >
                                        {sh.shape}
                                    </label>

                                    <div className="d-flex flex-wrap gap-2">
                                        {sh.sizes.map((s) => (
                                            <label
                                                className={`form-check-label form-label-sm rounded-1 border ${
                                                    styles.checkOption
                                                } ${
                                                    s.readonly === 1
                                                        ? styles.checkOptionReadoly
                                                        : ""
                                                }`}
                                                htmlFor={s.id}
                                                key={s.id}
                                                onMouseOver={(e) =>
                                                    handleImagePopOver(
                                                        e,
                                                        s.image
                                                    )
                                                }
                                                onMouseLeave={(e) =>
                                                    new Tooltip(
                                                        e.target
                                                    ).dispose()
                                                }
                                                data-group={`size-${
                                                    s.size_class
                                                }-${sh.shape.toLowerCase()}`}
                                                onClick={handleGroupSelect}
                                            >
                                                <input
                                                    className={`form-check-input specificoption size-${
                                                        s.size_class
                                                    }-${sh.shape.toLowerCase()}`}
                                                    type="checkbox"
                                                    value=""
                                                    id={s.id}
                                                    checked={s.selected}
                                                    name="size"
                                                    data-readonly={s?.readonly}
                                                    data-did={didData?.design}
                                                    data-size={s.size}
                                                    data-shape={sh.shape}
                                                    data-act="size"
                                                    data-group={`size-${
                                                        s.size_class
                                                    }-${sh.shape.toLowerCase()}`}
                                                    onChange={handleSelection}
                                                />
                                                {s.size}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SkuTransferItems;
