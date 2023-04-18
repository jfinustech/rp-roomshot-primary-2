import { useEffect, useState } from "react";
import styles from "../styles/modules/skuTransfer.module.scss";
import { Tooltip } from "bootstrap";
// import { ImagePup } from "../aux/ImagePup";
import { FiArrowRight, FiCheckCircle, FiCircle } from "react-icons/fi";

const ICON = {
    checked: <FiCheckCircle className="text-success" />,
    checkedReadonly: <FiCheckCircle className="text-primary" />,
    notchecked: <FiCircle className="text-secondary" />,
};

function SkuTransferItems({
    did,
    handleSelection,
    toggleSizeImages,
    transferToVendor,
    isFiltered,
}) {
    // const [designChange, setDesignChange] = useState(did?.design ?? null);
    // const [optionChange, setoptionChange] = useState([]);
    const [didData, setDidData] = useState(did);

    const handleSelectAllSizes = (e) => {
        //Check if all design colors and ids are showing if command is pushed.
        e.preventDefault();

        const shape = e.target.dataset.shape;

        const hasMetaKeyPress =
            e.shiftKey || e.metaKey || e.altKey || e.ctrlKey;

        if (hasMetaKeyPress && isFiltered) {
            return alert(
                `To select all size in ${shape} shape, remove the filter from options dropdown at the top by chooseing Show All option.`
            );
        }

        const container = hasMetaKeyPress
            ? e.target.closest(`.${styles.skuTransferWrapper}`)
            : e.target.closest(`.${styles.shapeContainer}`);
        const inputs = container.querySelectorAll(
            `.${styles.checkOption} [data-shape="${shape}"]`
        );

        const totalInputs = inputs.length;
        let totalInputsSelected = 0;
        inputs.forEach((element) => {
            if (element.checked && element.dataset.readonly === "0")
                totalInputsSelected++;
        });
        const action = totalInputs === totalInputsSelected ? false : true;
        inputs.forEach((element) => {
            if (element.dataset.readonly === "0") {
                element.checked = action;
                handleSelection(element);
            }
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
                return handleSelection(inp);
            });
        }
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
            });
            tooltip.show();
        }
    };

    useEffect(() => {
        setDidData(did);
    }, [did, handleSelection]);

    return (
        <div className="row border-bottom border-2 border-primary pb-5 mb-5 m-0 p-0">
            <div className="col-2">
                <div className={`sticky sticky-top ${styles.stickyTopMargin}`}>
                    <div className="d-flex justify-content-start align-items-start gap-2">
                        <span>
                            {didData.readonly === 1 && ICON.checked}
                            {didData.readonly === 0 && ICON.notchecked}
                        </span>

                        <div>
                            <div>{didData?.design}</div>
                            <small
                                className="text-muted d-block"
                                style={{ fontSize: "70%" }}
                            >
                                {didData?.designto}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`col-10 ${styles.optionRowWrapper}`}>
                {did.colors.map((c) => (
                    <div
                        className={`card mb-3 ${styles.optionRowWrapperInner}`}
                        key={c.id}
                    >
                        <div
                            className={`card-title border-bottom border-1 py-2 px-3 m-0`}
                        >
                            <p className="p-0 m-0">
                                <span className="me-2">
                                    {c.readonly === 1 && ICON.checked}
                                    {c.readonly === 0 && ICON.notchecked}
                                </span>
                                {c.color} <FiArrowRight />{" "}
                                <span className="text-muted">
                                    {c.rugpalcolor !== null &&
                                    parseInt(transferToVendor) === 7600
                                        ? c.rugpalcolor
                                        : c.color}
                                </span>
                            </p>
                        </div>
                        <div className="card-body mt-0 pt-1">
                            <div className="d-flex justify-content-start align-items-start flex-wrap mt-3">
                                {c.shapes.map((sh) => (
                                    <div
                                        key={sh.id}
                                        className={`me-3 d-flex flex-column gap-2 ${styles.shapeContainer}`}
                                    >
                                        <p
                                            className={`rounded-1 px-2 ${styles.shapeContainerTitle}`}
                                            onClick={handleSelectAllSizes}
                                            data-shape={sh.shape}
                                        >
                                            {sh.shape}
                                        </p>
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
                                                    data-color={c.color}
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
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // return (
    //     <div className="row border-bottom pb-5 mb-5 m-0 p-0">
    //         <div className="col-2 m-0 p-0">
    //             <div className={`sticky sticky-top ${styles.stickyTopMargin}`}>
    //                 <label
    //                     className={`form-check-label form-label-sm rounded-1 border ${
    //                         styles.checkOption
    //                     } ${
    //                         didData.readonly === 1
    //                             ? styles.checkOptionReadoly
    //                             : ""
    //                     }`}
    //                     htmlFor={didData?.id}
    //                 >
    //                     <input
    //                         className="form-check-input specificoption"
    //                         type="checkbox"
    //                         id={didData?.id}
    //                         checked={didData?.selected}
    //                         name="designid"
    //                         data-did={didData?.design}
    //                         data-act="design"
    //                         onChange={handleSelection}
    //                     />
    //                     {didData?.design}
    //                     <br />
    //                     <FiArrowDown /> <br />
    //                     {didData?.designto}
    //                 </label>
    //             </div>
    //         </div>

    //         <div className="col-3 m-0 p-0">
    //             <div className="ps-4 border-start h-100">
    //                 <div
    //                     className={`sticky sticky-top ${styles.stickyTopMargin}`}
    //                 >
    //                     {didData?.colors?.map((c) => (
    //                         <div key={c.id} className="mb-2">
    //                             <label
    //                                 className={`form-check-label form-label-sm rounded-1 border ${
    //                                     styles.checkOption
    //                                 } ${
    //                                     c.readonly === 1
    //                                         ? styles.checkOptionReadoly
    //                                         : ""
    //                                 }`}
    //                                 htmlFor={c.id}
    //                             >
    //                                 <input
    //                                     className="form-check-input specificoption"
    //                                     type="checkbox"
    //                                     value=""
    //                                     id={c.id}
    //                                     checked={c.selected}
    //                                     name="colorname"
    //                                     data-did={didData?.design}
    //                                     data-color={c.color}
    //                                     data-act="color"
    //                                     onChange={handleSelection}
    //                                 />
    //                                 {c.color} <FiArrowRight />{" "}
    //                                 {c.rugpalcolor !== null &&
    //                                 parseInt(transferToVendor) === 7600
    //                                     ? c.rugpalcolor
    //                                     : c.color}
    //                             </label>
    //                             <br />
    //                         </div>
    //                     ))}
    //                 </div>
    //             </div>
    //         </div>

    //         <div className="col-7 m-0 p-0">
    //             <div className="ps-4 border-start h-100">
    //                 {did?.shapes?.map((sh) => (
    //                     <div key={sh.id} className="d-block mb-2">
    //                         <div className="d-flex justify-content-start align-items-start gap-4">
    //                             <div
    //                                 className={`text-center flex-shrink-0 ${styles.sampleImageWrapper}`}
    //                             >
    //                                 <img
    //                                     src={
    //                                         sh.sizes[0].image ??
    //                                         `${process.env.PUBLIC_URL}/images/placeholder_lg.jpg`
    //                                     }
    //                                     alt=""
    //                                     className={`mt-4 cursor-pointer ${styles.sampleImage}`}
    //                                     onClick={(e) =>
    //                                         sh.sizes[0].image
    //                                             ? ImagePup(
    //                                                   sh.sizes[0].image,
    //                                                   "headshot"
    //                                               )
    //                                             : false
    //                                     }
    //                                 />
    //                             </div>
    //                             <div>
    //                                 <label
    //                                     className="form-check-label form-label-sm mb-2 cursor-pointer user-select-none"
    //                                     htmlFor={sh.id}
    //                                     onClick={handleSelectAllSizes}
    //                                 >
    //                                     {sh.shape}
    //                                 </label>

    //                                 <div className="d-flex flex-wrap gap-2">
    //                                     {sh.sizes.map((s) => (
    //                                         <label
    //                                             className={`form-check-label form-label-sm rounded-1 border ${
    //                                                 styles.checkOption
    //                                             } ${
    //                                                 s.readonly === 1
    //                                                     ? styles.checkOptionReadoly
    //                                                     : ""
    //                                             }`}
    //                                             htmlFor={s.id}
    //                                             key={s.id}
    //                                             onMouseOver={(e) =>
    //                                                 handleImagePopOver(
    //                                                     e,
    //                                                     s.image
    //                                                 )
    //                                             }
    //                                             onMouseLeave={(e) =>
    //                                                 new Tooltip(
    //                                                     e.target
    //                                                 ).dispose()
    //                                             }
    //                                             data-group={`size-${
    //                                                 s.size_class
    //                                             }-${sh.shape.toLowerCase()}`}
    //                                             onClick={handleGroupSelect}
    //                                         >
    //                                             <input
    //                                                 className={`form-check-input specificoption size-${
    //                                                     s.size_class
    //                                                 }-${sh.shape.toLowerCase()}`}
    //                                                 type="checkbox"
    //                                                 value=""
    //                                                 id={s.id}
    //                                                 checked={s.selected}
    //                                                 name="size"
    //                                                 data-readonly={s?.readonly}
    //                                                 data-did={didData?.design}
    //                                                 data-size={s.size}
    //                                                 data-shape={sh.shape}
    //                                                 data-act="size"
    //                                                 data-group={`size-${
    //                                                     s.size_class
    //                                                 }-${sh.shape.toLowerCase()}`}
    //                                                 onChange={handleSelection}
    //                                             />
    //                                             {s.size}
    //                                         </label>
    //                                     ))}
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 ))}
    //             </div>
    //         </div>
    //     </div>
    // );
}

export default SkuTransferItems;
