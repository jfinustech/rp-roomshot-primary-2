import styles from "../styles/modules/importMissingImages.module.scss";

function ImportMissingImagesImage({
    image: { path, did, color, shape, selected },
    handleSelectedImages,
}) {
    return (
        <div
            className={`rounded cursor-pointer ${styles.imagewrapper} ${
                selected
                    ? `border border-2 bg-light border-success ${styles.selectedimage}`
                    : ""
            }`}
            style={{
                backgroundImage: `url('rp-roomshot-primary-2/images/spinner2.gif')`,
            }}
            onClick={handleSelectedImages}
        >
            <img
                src={path}
                className={`rounded rounded-1`}
                alt={`${shape} ${color}`}
            />
            <div className={`mt-2 ${styles.imageinfo}`}>
                <small className="d-block m-0">
                    <span className="text-muted">{shape}</span>
                </small>
                <small className="d-block m-0">
                    <span className="text-muted">{color}</span>
                </small>
            </div>
        </div>
    );
}

export default ImportMissingImagesImage;
