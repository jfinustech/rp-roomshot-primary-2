import { useState } from "react";
import { FiX } from "react-icons/fi";
import styles from "../styles/modules/sideSection.module.scss";
import { createId } from "../aux/Helper";

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
                            <img src={item.imgThumb} alt={item.designShape} />
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

export default DesignSideList;
