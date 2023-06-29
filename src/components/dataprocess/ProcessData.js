import { useEffect, useState } from "react";
import Loading from "../Loading";
import styles from "../../styles/modules/dataProcess.module.scss";
import { FiAlertCircle, FiCheck, FiCircle } from "react-icons/fi";
import axios from "axios";

const PROCESS_URL = "https://sandbx.rugpal.com/office/jay/v2/designs.asp";

function ProcessData({ data, queue, processingQueue, processingStatus }) {
    const [status, setStatus] = useState("pending");

    const { designid } = data[0];

    useEffect(() => {
        const ax = (axData) => {
            return new Promise((resulve, reject) => {
                axios({
                    method: "POST",
                    url: PROCESS_URL,
                    data: axData,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                })
                    .then((d) => {
                        // console.log(d.data);
                        resulve(d.data);
                    })
                    .catch((err) => {
                        // console.log(err);
                        reject(err);
                    });
            });
        };

        const ProcessInsertData = (dataArray) => {
            return new Promise((resolve) => {
                const innerloop = async () => {
                    for (let row in dataArray) {
                        await ax(dataArray[row]);
                    }
                };
                resolve(innerloop());
            });
        };

        if (processingQueue === queue) {
            setStatus("processing");

            ProcessInsertData(data)
                .then((e) => {
                    setStatus("done");
                    processingStatus({ queue, status: "done" });
                })
                .catch((err) => {
                    //console.log(err);
                    setStatus("error");
                    processingStatus({ queue, status: "done" });
                });
        }
    }, [data, queue, processingQueue, processingStatus, designid]);

    return (
        <li className="m-0 d-flex justify-content-between align-items-center">
            <span>
                <small>Processing:</small>
                <p className="p-0 m-0">{designid}</p>
            </span>
            {status === "pending" ||
                (!status && (
                    <div
                        className={`${styles.statusiconwrapper} d-flex justify-content-center align-items-center`}
                    >
                        <FiCircle className="p-0 m-0 text-secondary" />
                    </div>
                ))}
            {status === "processing" && (
                <Loading size="xs" className="ms-auto" />
            )}
            {status === "done" && (
                <div
                    className={`${styles.statusiconwrapper} d-flex justify-content-center align-items-center`}
                >
                    <FiCheck className="p-0 m-0 text-success" />
                </div>
            )}
            {status === "error" && (
                <div
                    className={`${styles.statusiconwrapper} d-flex justify-content-center align-items-center`}
                >
                    <FiAlertCircle className="p-0 m-0 text-danger" />
                </div>
            )}
        </li>
    );
}

export default ProcessData;
