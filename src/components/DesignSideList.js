import { useEffect, useState } from "react";
import { FiGlobe, FiTarget, FiX } from "react-icons/fi";
import styles from "../styles/modules/sideSection.module.scss";
import { createId } from "../aux/Helper";
import { Tooltip } from "bootstrap";
import {
    LazyLoadImage,
    trackWindowScroll,
} from "react-lazy-load-image-component";

function DesignSideList({ Items, handleItem, id }) {
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const handleFindItem = (e) => {
        const itemSrc = e.target.src;
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

    useEffect(() => {
        const uniqueicons = document.querySelectorAll(".unique-icons");
        uniqueicons.forEach((icon) => {
            new Tooltip(icon);
            // if (btnTransferRef.current) new Tooltip(btnTransferRef.current);
        });
    }, [Items]);

    if (!Items || Items.length <= 0)
        return (
            <small className="text-muted d-block text-center">No Item.</small>
        );

    return (
        <>
            {Items.map((item) => (
                <div
                    key={item.id}
                    className={`position-relative overflow-hidden mb-2 flex-shrink-0 ${styles.sideImageWrapper}`}
                >
                    <div className={`border d-flex flex-column`}>
                        <div
                            className="p-2 text-center cursor-zoom-in"
                            onClick={handleFindItem}
                        >
                            <span
                                className={`d-flex justify-content-center align-items-center rounded rounded-pill ${styles.imgIconUnique}`}
                            >
                                {item.is_unique ? (
                                    <FiTarget
                                        className="text-info unique-icons"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        data-bs-html="true"
                                        data-bs-title={`<small>This image belongs to ${item.brand} only</small>`}
                                    />
                                ) : (
                                    <FiGlobe
                                        className="text-danger unique-icons"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        data-bs-html="true"
                                        data-bs-title={`<small>This image assigned to <br />multiple brands.</small>`}
                                    />
                                )}
                            </span>
                            <LazyLoadImage
                                src={item.imgThumb}
                                alt={item.designShape}
                            />
                        </div>
                        <div className="position-relative">
                            <button
                                className="d-flex justify-content-center align-items-center"
                                onClick={() => handleItem(item)}
                            >
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
        </>
    );
}

export default trackWindowScroll(DesignSideList);
