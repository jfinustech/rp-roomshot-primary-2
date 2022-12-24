import axios from "axios";
const SETSOFTDELETE_URL = "https://sandbx.rugpal.com/office/jay/v2/designs.asp";

export const SetSoftDelete = async (id) => {
    const fetch = axios({
        method: "POST",
        url: SETSOFTDELETE_URL,
        params: {
            id: id,
            action: "SETSOFTDELETE",
        },
        headers: {
            "Content-Type": "application/json",
        },
    });

    const response = await fetch.then((e) => e.data);

    return response;
};
