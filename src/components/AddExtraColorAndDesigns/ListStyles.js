function ListStyles({
    list,
    inputName,
    selectedLabel,
    selected,
    readonly,
    action,
    callChanges,
}) {
    // const getRandomNum = (min, max) =>
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
                    list.map((item) => {
                        const item_selected =
                            selected && typeof selected !== "undefined"
                                ? selected.toLowerCase() === item.toLowerCase()
                                    ? "btn-primary"
                                    : "btn-outline-secondary"
                                : "btn-outline-secondary";
                        return (
                            <button
                                className={`btn btn-sm py-0 px-2 ${item_selected} `}
                                key={Math.random() + "-" + item}
                                name={inputName}
                                disabled={readonly}
                                onClick={() => callChanges(action, item)}
                            >
                                {item}
                            </button>
                        );
                    })}

                {(!list || list.length <= 0) && "Nothing here!"}
            </div>
        </>
    );
}

export default ListStyles;
