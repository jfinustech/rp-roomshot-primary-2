import { useState } from "react";
import { FiX, FiImage, FiEye, FiSearch } from "react-icons/fi";
import styles from "../styles/modules/sideSectionModal.module.scss";
import { createId } from "../aux/Helper";
import { ImagePup } from "../aux/ImagePup";

function DesignSideModal({ Items }) {
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const handleFindItem = (src) => {
        const itemSrc = src;
        const targetItem = document.querySelector(
            `.mainListImage[src='${itemSrc}']`
        );
        const currentlyHighlighted = document.querySelector(".highlistItem");

        if (currentlyHighlighted) {
            currentlyHighlighted.classList.remove("highlistItem");
            if (isTimerRunning) clearTimeout();
        }

        const randomClass = createId(10);
        const targetItemParent = targetItem.closest(".mainListImageWrapper");
        targetItemParent.classList.add(randomClass, "highlistItem");
        targetItemParent.scrollIntoView({
            behavior: "smooth",
        });

        setIsTimerRunning(true);
        setTimeout(() => {
            const targetClass =
                document.querySelector(`.${randomClass}`) ?? null;
            targetClass?.classList.remove("highlistItem", `.${randomClass}`);
        }, 3000);
    };

    if (!Items || Items.length <= 0)
        return (
            <div className="text-muted d-block text-center p-5">
                <h1 className="text-primary">
                    <FiImage />
                </h1>
                <div className="mt-4">No Item Found!</div>
            </div>
        );

    return (
        <div className="d-flex flex-wrap justify-content-start align-items-center gap-3">
            {Items.map((item) => (
                <div
                    key={item.id}
                    className={`position-relative overflow-hidden mb-2 ${styles.sidePupImageWrapper}`}
                >
                    <div className={`border d-flex flex-column flex-1`}>
                        <div className="p-2 text-center position-relative">
                            <div
                                className={`${styles.imageActionButtons} d-flex justify-content-center align-items-center gap-3`}
                            >
                                <div
                                    className={`btn btn-outline-secondary rounded rounded-pill border-white text-white p-0 m-0 d-flex justify-content-center align-items-center ${styles.btnRound}`}
                                    onClick={(e) => ImagePup(item.imgThumb)}
                                >
                                    <FiEye />
                                </div>
                                <div
                                    className={`btn btn-outline-secondary rounded rounded-pill border-white text-white p-0 m-0 d-flex justify-content-center align-items-center ${styles.btnRound}`}
                                    onClick={(e) =>
                                        handleFindItem(item.imgThumb)
                                    }
                                    data-bs-dismiss="modal"
                                >
                                    <FiSearch />
                                </div>
                            </div>
                            <img src={item.imgThumb} alt={item.designShape} />
                        </div>
                        <div className="position-relative">
                            <button className="d-flex justify-content-center align-items-center">
                                <FiX />
                            </button>
                            <small
                                className={`d-block p-1 border-top text-center text-muted`}
                            >
                                {item.designShape ?? (
                                    <span className={`${styles.highlight}`}>
                                        Shape ?
                                    </span>
                                )}
                            </small>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DesignSideModal;
