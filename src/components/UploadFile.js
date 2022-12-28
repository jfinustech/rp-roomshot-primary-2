import { FiUploadCloud } from "react-icons/fi";
import { createId } from "../aux/Helper";
import styles from "../styles/modules/uploadFile.module.scss";
import axios from "axios";
import { useRef, useState } from "react";
const UPLOAD_URL = "https://sandbx.rugpal.com/office/jay/v2/upload/";

function UploadFile({ designid, designcolor, handleUploadResponse }) {
    const getid = createId(10);

    const [uploadPercent, setUploadPercent] = useState(0);
    const fileFiledRef = useRef();

    const handleUploadFile = (e) => {
        e.preventDefault();

        const targetFile = e.target.files[0];
        setUploadPercent(1);

        if (!targetFile || typeof targetFile === "undefined") return;

        fileFiledRef.current.disabled = true;

        const options = {
            url: UPLOAD_URL,
            method: "POST",
            data: {
                img1: targetFile,
                designid: designid,
                designcolor: designcolor,
                shape: null,
                ipfield: "01.02.03z",
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },

            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                let percent = Math.floor((loaded * 100) / total);
                // console.log(`${loaded}kb of ${total}kb | ${percent}%`);

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
                console.log(er.message);
                setUploadPercent(0);
                fileFiledRef.current.type = "text";
                fileFiledRef.current.type = "file";
                fileFiledRef.current.disabled = false;
            });
        // .finally((e) => {});
    };

    return (
        <div>
            <label
                htmlFor={getid}
                className={`${
                    styles.uploadbtn
                } btn btn-outline-secondary border rounded-1 mb-1 d-flex justify-content-start align-items-center ${
                    uploadPercent > 0 ? "disabled" : ""
                }`}
            >
                <FiUploadCloud className="me-2" />{" "}
                <small>Upload New Image</small>
                <input
                    ref={fileFiledRef}
                    type="file"
                    name="file"
                    id={getid}
                    className="d-none"
                    onChange={handleUploadFile}
                    disabled={uploadPercent > 0}
                />
            </label>
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
        </div>
    );
}

export default UploadFile;
