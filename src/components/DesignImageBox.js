import { useState, useContext, useEffect, useRef } from "react";
import { MainContext } from "./MainContext";
import styles from "../styles/modules/imagebox.module.scss";
import { FiTrash2, FiArrowRight } from "react-icons/fi";
import { ImagePup } from "../aux/ImagePup";
import { Dropdown } from "bootstrap";
import { createId } from "../aux/Helper";

// const initBootstrapDropdown = (selector) => {
//     const dropdownElementList = document.querySelectorAll(selector)
//     const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new Dropdown(dropdownToggleEl))
// }

function DesignImageBox({
    image,
    handleShape,
    handlePrimary,
    handleSoftDelete,
    handleHardDelete,
    handleHardDeleteBulk,
}) {
    const [isPrimary, setIsPrimary] = useState(image.is_primary);
    const [isDeleted, setIsDeleted] = useState(!image.show_image);
    const [isShape, setIsShape] = useState(image.designShape ?? null);
    const { hideDeleted, hideAssigned } = useContext(MainContext);
    const [dropdownId] = useState(createId(10));

    useEffect(() => {
        setIsPrimary(image.is_primary);
        setIsDeleted(!image.show_image);
        setIsShape(image.designShape ?? null);
    }, [image.is_primary, image.show_image, image.designShape, image]);

    useEffect(() => {
        const btn = document.getElementById(dropdownId);
        let act = undefined;
        if (btn) {
            act = new Dropdown(btn, {
                autoClose: true,
                offset: "-30,5",
            });
            btn.addEventListener("click", () => act.show());
        }

        return () => {
            if (btn) {
                btn.removeEventListener("click", () => act.show());
                act.dispose();
            }
        };
    }, [dropdownId]);

    return (
        <div
            className={`mainListImageWrapper flex-grow-1 border position-relative p-3 rounded-1 ${
                styles.imabeBoxWrapper
            } ${
                isPrimary
                    ? styles.borderInfo
                    : isShape
                    ? styles.borderSuccess
                    : ""
            } ${hideDeleted === "1" && isDeleted ? "d-none" : ""} ${
                hideAssigned === "1" && isShape ? "d-none" : ""
            }`}
        >
            <div className="row">
                <div className="col-6">
                    <img
                        src={image.imgThumb}
                        alt={image.designID}
                        className={`mainListImage rounded-1 cursor-pointer ${
                            styles.imabeBoxImage
                        } ${isDeleted ? styles.deleted : ""}`}
                        onClick={(e) => ImagePup(image.imgThumb)}
                    />
                </div>
                <div className="col-6">
                    <div className="d-flex flex-column gap-2">
                        <button
                            className={`py-1 btn btn-sm rounded-1 ${
                                isPrimary
                                    ? "btn-info text-white"
                                    : "btn-outline-info"
                            }`}
                            disabled={isDeleted}
                            onClick={(e) => handlePrimary(image)}
                        >
                            Primary
                        </button>
                        {image.shapes.map((shape) => (
                            <button
                                key={shape.shape}
                                className={`py-1 btn btn-sm rounded-1 ${
                                    isShape?.toLowerCase().trim() ===
                                    shape.shape?.toLowerCase().trim()
                                        ? "btn-success"
                                        : "btn-outline-secondary"
                                }`}
                                disabled={isDeleted}
                                onClick={(e) => handleShape(image, shape.shape)}
                            >
                                {shape.shape}
                            </button>
                        ))}

                        {
                            // !isPrimary && isShape === null ? (
                            isDeleted ? (
                                <button
                                    className={`py-1 btn btn-outline-success btn-sm rounded-1`}
                                    onClick={() => handleSoftDelete(image)}
                                >
                                    Resume
                                </button>
                            ) : (
                                <div className="d-flex justify-content-start align-items-center gap-2">
                                    <button
                                        className={`flex-fill py-1 btn btn-outline-danger btn-sm rounded-1`}
                                        onClick={() => handleSoftDelete(image)}
                                        disabled={isPrimary || isShape !== null}
                                    >
                                        Delete
                                    </button>

                                    <div className="dropdown dropstart droptop">
                                        <button
                                            id={dropdownId}
                                            className={`p-0 m-0 btn btn-outline-danger btn-sm rounded-1 border-0 rounded rounded-pill d-flex justify-content-center align-items-center`}
                                            style={{ width: 31, height: 31 }}
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                            disabled={
                                                isPrimary || isShape !== null
                                            }
                                        >
                                            <FiTrash2 />
                                        </button>

                                        <ul
                                            className="dropdown-menu"
                                            style={{
                                                top: "-20px",
                                            }}
                                        >
                                            <li>
                                                <small className="m-0 py-1 px-3">
                                                    Are you sure?
                                                </small>
                                            </li>
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item d-flex justify-content-start align-items-center gap-2 me-5"
                                                    onClick={() =>
                                                        handleHardDelete(image)
                                                    }
                                                >
                                                    <FiTrash2 className="text-danger" />
                                                    <small>
                                                        {`${image.brand} Only`}
                                                    </small>
                                                    <FiArrowRight className="ms-auto text-muted" />
                                                </button>
                                            </li>
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item d-flex justify-content-start align-items-center gap-2 me-5"
                                                    onClick={() =>
                                                        handleHardDeleteBulk(
                                                            image
                                                        )
                                                    }
                                                >
                                                    <FiTrash2 className="text-danger" />
                                                    <small>
                                                        Delete For All Brands
                                                    </small>
                                                    <FiArrowRight className="ms-auto text-muted" />
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )
                            // ) : (
                            //     ""
                            // )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DesignImageBox;
