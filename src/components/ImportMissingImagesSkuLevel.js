import { useState, useRef, useEffect } from "react";
import axios from "axios";

const ImportMissingImagesSkuLevel = ({ singleItem, shape, styles }) => {
    const [uploadPercent, setUploadPercent] = useState(0);
    const [item, setItem] = useState(singleItem);
    const fileFiledRef = useRef();
    const UPLOAD_URL = `https://sandbx.rugpal.com/office/jay/v2/upload-sku-level/?sku=${item.sku}`;

    // const getid = createId(10);

    const handleUploadFile = () => {
        const targetFile = fileFiledRef.current.files[0];
        setUploadPercent(1);

        if (!targetFile || typeof targetFile === "undefined") return;

        fileFiledRef.current.disabled = true;

        //"sku|value|desingid|value|designcolor|value|shape|value|collectionName|value"
        const options = {
            url: UPLOAD_URL,
            method: "POST",
            data: {
                uploader: targetFile,
                sku: item.sku,
                designid: item.designid,
                designcolor: item.designcolor,
                collectionname: item.collectionname,
                shape: shape,
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },

            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                let percent = Math.floor((loaded * 100) / total);

                if (percent < 100) setUploadPercent(percent);
            },
        };

        axios(options)
            .then((res) => {
                setUploadPercent(100);
                setTimeout(() => {
                    setUploadPercent(0);
                    fileFiledRef.current.type = "text";
                    fileFiledRef.current.type = "file";
                    fileFiledRef.current.disabled = false;
                }, 1000);

                if (res) handleUploadResponse(res.data);
            })
            .catch((er) => {
                setUploadPercent(0);
                fileFiledRef.current.type = "text";
                fileFiledRef.current.type = "file";
                fileFiledRef.current.disabled = false;
            });
        // .finally((e) => {});
    };

    const handleUploadResponse = (data) => {
        if (data[0]) setItem(data[0]);
    };

    useEffect(() => {
        const inp = fileFiledRef.current;
        inp.addEventListener("change", handleUploadFile);
        return () => {
            inp.removeEventListener("change", handleUploadFile);
        };
    });

    return (
        <li className={`skudroparea border border-1 rounded rounded-1`}>
            <div className={`${styles.skulevelthumb}`}>
                <div className={`${styles.skulevelthumb_imagewrapper}`}>
                    <img
                        src={item.image}
                        alt={`sku ${item.sku}`}
                        className="skudraghandle watchdragged img-fluid"
                        data-sku={item.sku}
                    />
                </div>
                <div className={`${styles.skulevelthumb_infowrapper}`}>
                    <b className="d-block">SKU:</b>
                    {item.sku}
                    <div className="d-flex justify-content-start align-items-center mt-2">
                        <span className="pe-3">
                            <b className="d-block">Size:</b>
                            {item.size}
                        </span>
                        <span>
                            <b className="d-block">Shape:</b>
                            {shape}
                        </span>
                    </div>
                </div>
            </div>
            <div
                className="progress"
                style={{ height: 5, opacity: uploadPercent > 0 ? 1 : 0 }}
            >
                <div
                    className={`${
                        uploadPercent < 100
                            ? "progress-bar-striped progress-bar-animated bg-info"
                            : "bg-success"
                    } progress-bar`}
                    role="progressbar"
                    aria-label="Example with label"
                    style={{ width: `${uploadPercent}%` }}
                    aria-valuenow={uploadPercent}
                    aria-valuemin="0"
                    aria-valuemax="100"
                ></div>
            </div>
            <div
                className={`d-flex justify-content-center align-items-center ${styles.skulevelthumb_btn_wrapper}`}
            >
                <button className="btn p-1 rounded-0 border-top border-end border-1 w-50">
                    Existing
                </button>
                <label
                    htmlFor={item.sku}
                    className="btn p-1 rounded-0 border-top border-1 w-50"
                >
                    Upload
                </label>
            </div>

            <input
                ref={fileFiledRef}
                type="file"
                name="file"
                disabled={uploadPercent > 0}
                id={item.sku}
                className="d-none"
            />
        </li>
    );
};

export default ImportMissingImagesSkuLevel;
