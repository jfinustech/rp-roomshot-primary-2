import styles from "../../styles/modules/colorPopOver.module.scss";

const ColorOptions = ({
    list,
    inputName,
    selectedLabel,
    selected,
    readonly,
    action,
    callChanges,
}) => {
    // const getRandomNum = (min = 1111, max = 9999) =>
    //     Math.floor(Math.random() * (max - min + 1) + min);

    let selected_val = selected;
    let selected_default = "";
    if (selected && selected !== "" && selected.includes("::")) {
        selected_val = selected.split("::")[0];
        selected_default = selected.split("::")[1];
        selected = selected_val;
    }

    return (
        <>
            <label className="form-label">
                <span className="text-muted">
                    {selectedLabel ?? "--Missing Label"}:{" "}
                </span>
                {selected === "" ||
                selected === "null" ||
                selected === null ||
                typeof selected === "undefined"
                    ? "N/A"
                    : selected}
                {selected_default !== "" && (
                    <span> (RP: {selected_default})</span>
                )}
            </label>
            <div className="d-flex flex-wrap justify-content-start align-items-center gap-2">
                {list &&
                    list.length > 0 &&
                    list.sort().map((color) => {
                        let cat_selected = "btn-outline-secondary";

                        return (
                            <span key={Math.random()}>
                                <div
                                    className={`position-relative ${styles.colorcontainerwrapper}`}
                                >
                                    <div
                                        className={`${styles.colorpopwrapper} rounded-1 shadow-sm`}
                                    >
                                        <h6
                                            className={`${styles.option_color_title} mb-4 pb-2 border-bottom flex-1`}
                                        >
                                            {color.color_cat}
                                        </h6>
                                        {color.color_cat_options
                                            .sort()
                                            .map((options) => {
                                                if (
                                                    selected &&
                                                    typeof selected !==
                                                        "undefined"
                                                ) {
                                                    if (
                                                        selected.toLowerCase() ===
                                                        options.color_name.toLowerCase()
                                                    ) {
                                                        cat_selected =
                                                            "btn-primary";
                                                    }
                                                }

                                                const color_selected =
                                                    selected &&
                                                    typeof selected !==
                                                        "undefined"
                                                        ? selected.toLowerCase() ===
                                                          options.color_name.toLowerCase()
                                                            ? styles.active
                                                            : ""
                                                        : "";

                                                return (
                                                    <div
                                                        className={`${color_selected} ${styles.option_color_item} cursor-pointer`}
                                                        key={options.color_name}
                                                        onClick={() =>
                                                            callChanges(
                                                                action,
                                                                options.color_name
                                                            )
                                                        }
                                                    >
                                                        <div
                                                            className={`${styles.option_color_hex} border`}
                                                            style={{
                                                                background:
                                                                    options.color_hex,
                                                            }}
                                                        ></div>
                                                        <div>
                                                            {options.color_name}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                    <button
                                        className={`btn btn-sm py-0 px-2 ${cat_selected} `}
                                        key={
                                            Math.random() +
                                            "-" +
                                            color.color_cat
                                        }
                                        name={inputName}
                                        disabled={readonly}
                                    >
                                        {color.color_cat}
                                    </button>
                                </div>
                            </span>
                        );
                    })}
            </div>
        </>
    );
};

export default ColorOptions;
