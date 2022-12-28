import { Modal } from "bootstrap";
import { createRoot } from "react-dom/client";
import BootstrapModal from "../components/BootstrapModal";
import MainContextProvider from "../components/MainContext";

export const HandleModal = (
    title,
    dataComponent,
    data,
    act = null,
    size = "modal-xl"
) => {
    let RootID = "modalroot";
    let MainModalRoot = document.querySelector(`#${RootID}`);
    if (MainModalRoot) MainModalRoot.remove();

    const div = document.createElement("div");
    div.id = `${RootID}`;
    document.querySelector("body").appendChild(div);

    new Promise((resolve) => {
        const root = createRoot(document.getElementById(`${RootID}`));
        root.render(
            <MainContextProvider>
                <BootstrapModal
                    title={title}
                    dataComponent={dataComponent}
                    data={data}
                    act={act}
                    size={size}
                />
            </MainContextProvider>
        );

        resolve();
    })
        .then((root) => {
            const modal = new Modal("#MainModal");
            modal.show();
            const onclose = document
                .querySelector("#MainModal")
                .addEventListener("hidden.bs.modal", (event) => {
                    document
                        .querySelector("#MainModal")
                        .removeEventListener("hidden.bs.modal", onclose);
                    document.querySelector(`#${RootID}`).remove();
                });
        })
        .catch((err) => console.error(err));
};
