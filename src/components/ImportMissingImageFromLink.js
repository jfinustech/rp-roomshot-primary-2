import axios from "axios";
import { useState, useRef } from "react";
import styles from "../styles/modules/importMissingImages.module.scss";
import Loading from "./Loading";

function ImportMissingImageFromLink({
    vendor,
    vendorname,
    collection,
    designid,
    designcolor,
    imageRecordUrl,
    handleChangeVendor,
}) {
    const [imageField, setImageField] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const imagewrapper = useRef();

    const handleFetch = () => {
        imagewrapper.current.innerHTML = "";
        setErrorMessage("");

        try {
            new URL(imageField);

            const image_src = imageField.split("?")[0];
            const image_file_name = image_src.split("/").slice(-1)[0];
            const extension = image_file_name
                .split(".")
                .slice(-1)[0]
                .toLowerCase();

            if (extension !== "jpg" && extension !== "jpeg") {
                throw new Error("Invalid image link or format.");
            }

            imagewrapper.current.html = "";
            const itemImage = document.createElement("img");
            itemImage.src = imageField;
            itemImage.id = "singleimagetodownload";

            itemImage.dataset.name = image_file_name;

            imagewrapper.current.append(itemImage);

            const btn = document.createElement("button");
            btn.setAttribute("type", "button");
            btn.innerText = "Download Image";
            btn.classList = "btn btn-outline-info mt-4";
            btn.onclick = (e) => handleTransferImages(e);
            imagewrapper.current.append(btn);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleTransferImages = async (e) => {
        setIsProcessing(true);
        const image = imagewrapper.current.querySelector(
            "#singleimagetodownload"
        );
        await axios({
            method: "POST",
            url: imageRecordUrl,
            data: {
                name: image.dataset.name,
                image: image.src,
                designid: designid,
                color: designcolor,
                shape: "",
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then((e) => {
                imagewrapper.current.innerHTML = "";
                setImageField("");
                setIsProcessing(false);
                handleChangeVendor(
                    vendor,
                    vendorname,
                    designid,
                    designcolor,
                    collection,
                    true
                );
            })
            .catch((err) => {
                setErrorMessage(err);
                setIsProcessing(false);
                imagewrapper.current.innerHTML = "";
            });
    };

    return (
        <div>
            {isProcessing && (
                <div
                    className={`d-flex justify-content-center align-items-center ${styles.coverloading}`}
                >
                    <Loading cover />
                </div>
            )}
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control border border-secondary"
                    placeholder="Paste a valid image URL here"
                    aria-label="Paste a valid image URL here"
                    aria-describedby="button-addon2"
                    value={imageField}
                    onChange={(e) => setImageField(e.target.value)}
                />
                <button
                    className="btn btn-outline-secondary border border-secondary"
                    type="button"
                    id="button-addon2"
                    onClick={(e) => handleFetch(imageField)}
                >
                    Fetch Image
                </button>
            </div>
            {setErrorMessage !== "" && (
                <div className="text-danger">
                    <small>{errorMessage}</small>
                </div>
            )}
            <div
                className={`text-center d-flex flex-column justify-content-center align-items-center ${styles.singleimage_wrapper}`}
                ref={imagewrapper}
            ></div>
            {/* {mainImage && <div ref={imagewrapper}></div>} */}
        </div>
    );
}

export default ImportMissingImageFromLink;
