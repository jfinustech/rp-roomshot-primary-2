import { useEffect, useRef, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import styles from "../../styles/modules/dataProcess.module.scss";
import ProcessData from "./ProcessData";

const handleCollapsBox = (e) => {
    const target = e.currentTarget;
    const container = target.closest(`.${styles.dataProcessWrapper}`);
    const collapsClass = styles.dataProcessCollapse;

    if (container.classList.contains(collapsClass)) {
        container.classList.remove(collapsClass);
        container.setAttribute("style", "bottom: 0");
    } else {
        container.classList.add(collapsClass);
        container.setAttribute(
            "style",
            `bottom: -${container.offsetHeight - target.offsetHeight}px`
        );
    }
};

function Processor({ dataBlob, reloadInitPage, setReloadTransferToVendorTab }) {
    const [groupData, setGroupData] = useState([]);
    const [processingQueue, setProcessingQueue] = useState();

    const pannelRef = useRef();

    useEffect(() => {
        if (!dataBlob) return;
        const prepareData = (dataBlob) => {
            const groupByDesignid = dataBlob.reduce((group, item) => {
                const { designid } = item;
                group[designid] = group[designid] ?? [];
                group[designid].push(item);

                return group;
            }, {});

            let finalArray = [];
            let queue = 1000;
            for (let i in groupByDesignid) {
                finalArray.push({
                    queue,
                    did: i,
                    data: { ...groupByDesignid[i] },
                });
                queue++;
            }

            setProcessingQueue(finalArray[0].queue);
            setGroupData(finalArray);
        };
        prepareData(dataBlob);
    }, [dataBlob]);

    const processingStatus = (stat) => {
        const nextqueue = stat.queue + 1;
        if (stat.status === "done") {
            setProcessingQueue(nextqueue);
        }
        if (groupData[groupData.length - 1].queue < nextqueue) {
            // dispatchReloadInitialPage({
            //     type: "RELOAD",
            //     payload: Math.random(),
            // });

            reloadInitPage(Math.random());
            setReloadTransferToVendorTab(Math.random());

            setTimeout(() => {
                document.getElementById("processor")?.remove();
                setGroupData(null);
            }, 5000);
        }
    };

    return (
        <>
            {groupData && (
                <div className={`${styles.dataProcessWrapper} shadow p-0 m-0`}>
                    <div
                        className={`${styles.dataProcessHeader} d-flex justify-content-between align-items-center user-select-none cursor-pointer`}
                        onClick={handleCollapsBox}
                        // onClick={(e) => setReloadTemp(Math.random())}
                    >
                        <span>Processing</span>
                        <FiMinus className={`${styles.dataProcessIconMinus}`} />
                        <FiPlus className={`${styles.dataProcessIconPlus}`} />
                    </div>
                    <ul className="p-0 m-0 d-block noScrollBar" ref={pannelRef}>
                        {groupData.map((d, i) => (
                            <ProcessData
                                key={i}
                                data={d.data}
                                queue={d.queue}
                                processingQueue={processingQueue}
                                processingStatus={processingStatus}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}

export default Processor;
