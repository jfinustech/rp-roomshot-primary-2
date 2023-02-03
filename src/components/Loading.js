function Loading({ cover, size = null }) {
    const loadingsize = (size) => {
        let sizeclass;

        switch (size) {
            case "md":
                sizeclass = "lds-ripple-md";
                break;
            case "sm":
                sizeclass = "lds-ripple-sm";
                break;
            case "xs":
                sizeclass = "lds-ripple-xs";
                break;
            case "xxs":
                sizeclass = "lds-ripple-xxs";
                break;
            default:
                sizeclass = "";
                break;
        }

        return sizeclass;
    };
    return (
        <>
            {cover && (
                <div className="loadingcontainer d-flex justify-content-center align-items-center">
                    <div className="lds-ripple">
                        <div></div>
                        <div></div>
                    </div>
                </div>
            )}
            {!cover && (
                <div className={`lds-ripple ${loadingsize(size)}`}>
                    <div></div>
                    <div></div>
                </div>
            )}
        </>
    );
}

export const loadingRaw = (
    <div className="loadingcontainer d-flex justify-content-center align-items-center">
        <div className="lds-ripple">
            <div></div>
            <div></div>
        </div>
    </div>
);

export default Loading;
