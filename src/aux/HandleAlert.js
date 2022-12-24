import React from "react";
import { createRoot } from "react-dom/client";

import { Modal } from "bootstrap";
import {
    FiSlash,
    FiCheck,
    FiAlertTriangle,
    FiCoffee,
    FiVolume,
} from "react-icons/fi";

const iconSwitch = (type) => {
    let alertIcon;
    switch (type) {
        case "danger":
            alertIcon = {
                icon: <FiSlash className="m-0 p-0" />,
                cls: "danger",
                title: "Error",
            };
            break;
        case "success":
            alertIcon = {
                icon: <FiCheck className="m-0 p-0" />,
                cls: "success",
                title: "Success",
            };
            break;
        case "warning":
            alertIcon = {
                icon: <FiAlertTriangle className="m-0 p-0" />,
                cls: "warning",
                title: "Warning",
            };
            break;
        case "info":
            alertIcon = {
                icon: <FiVolume className="m-0 p-0" />,
                cls: "info",
                title: "Info",
            };
            break;
        default:
            alertIcon = {
                icon: <FiCoffee className="m-0 p-0" />,
                cls: "secondary",
                title: "",
            };
            break;
    }

    return (
        <div
            className={`text-${alertIcon.cls} d-flex justify-content-center align-items-center`}
            style={{ fontSize: "22px", width: 25, height: 25 }}
        >
            {alertIcon.icon}
        </div>
    );
};

export const HandleAlert = ({ type, title, body }) => {
    let AlertRootID = "alertroot";
    let AlertModalRoot = document.querySelector(`#${AlertRootID}`);
    if (AlertModalRoot) AlertModalRoot.remove();

    const div = document.createElement("div");
    div.id = `${AlertRootID}`;
    document.querySelector("body").appendChild(div);

    new Promise((resolve) => {
        const root = createRoot(document.getElementById(`${AlertRootID}`));
        root.render(
            <div
                className="modal fade"
                id="MainAlertModal"
                aria-labelledby="MainAlertModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content sm">
                        <div className="modal-header">
                            <div className="d-flex justify-content-start align-items-center gap-2">
                                {iconSwitch(type)}
                                <div className="text-secondary">{title}</div>
                            </div>
                        </div>
                        <div className="modal-body">
                            <div className="d-flex justify-content-start align-items-start">
                                <div>{body}</div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary rounded-1 px-4"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
        resolve();
    })
        .then((root) => {
            const modal = new Modal("#MainAlertModal");
            modal.show();
            const onclose = document
                .querySelector("#MainAlertModal")
                .addEventListener("hidden.bs.modal", (event) => {
                    document
                        .querySelector("#MainAlertModal")
                        .removeEventListener("hidden.bs.modal", onclose);
                    document.querySelector(`#${AlertRootID}`).remove();
                });
        })
        .catch((err) => console.error("Alert Error: ", err));
};
