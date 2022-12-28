export const ImagePup = (image, imageType = "roomshot") => {
    if (image === "" || typeof image === "undefined") return;
    const image_src =
        imageType === "roomshot"
            ? image.replace("_thumb.jpg", "_large.jpg")
            : image.replace("_thumb.jpg", ".jpg");
    const div = document.createElement("div");
    div.classList = "modalwrapper text-white modalwrapper_close";
    div.setAttribute(
        "style",
        "z-index: 10000; position: fixed; top: 0; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center"
    );
    div.textContent = "Loading....";

    const closebtn = document.createElement("a");
    closebtn.href = "void();";
    closebtn.classList =
        "border border-white border-1 d-flex justify-content-center align-items-center position-absolute bg-white text-decoration-none modalwrapper_close";
    closebtn.innerHTML = "&#10006;";
    closebtn.setAttribute(
        "style",
        "width: 40px; height: 40px; border-radius: 50%; right: 30px; top: 30px;"
    );
    div.appendChild(closebtn);

    // document.body.classList = "overflow-hidden";
    document.body.appendChild(div);

    const addimage = new Promise((resolve, reject) => {
        // setTimeout(() => {
        const img = new Image();
        img.className = "img-fluid";
        img.onload = async () => {
            img.src = await image_src;
        };
        img.setAttribute(
            "style",
            "max-height: 90vh; max-width: 90vw; border-radius: 3px;"
        );
        img.src = image_src;
        resolve(img);
    });

    const remove_modal = () => {
        div.addEventListener("click", (e) => {
            if (e.target.classList.contains("modalwrapper_close")) {
                e.preventDefault();
                div.removeEventListener("click", null);
                div.remove();
                // document.body.classList = "";
            }
        });
    };

    addimage.then((img) => {
        div.removeChild(div.firstChild);
        div.appendChild(img);
        remove_modal();

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                div.remove();
            }
            document.removeEventListener("keydown", null);
        });
        document.addEventListener("wheel", (e) => {
            div.remove();
            document.removeEventListener("wheel", null);
        });
    });
};
