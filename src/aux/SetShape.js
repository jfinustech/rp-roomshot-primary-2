import axios from "axios";

const SETSHAPE_URL = "https://sandbx.rugpal.com/office/jay/v2/designs.asp";
export const SetShape = async (id, shape) => {
    const fetch = axios({
        method: "POST",
        url: SETSHAPE_URL,
        params: {
            id: id,
            designshape: shape,
            action: "SETSHAPE",
        },
        headers: {
            "Content-Type": "application/json",
        },
    });

    const response = await fetch.then((e) => e.data);

    return response;
};
