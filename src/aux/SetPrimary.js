import axios from "axios";
const SETPRIMARY_URL = "https://sandbx.rugpal.com/office/jay/v2/designs.asp";

export const SetPrimary = async (id) => {
    const fetch = axios({
        method: "POST",
        url: SETPRIMARY_URL,
        params: {
            id: id,
            action: "SETPRIMARY",
        },
        headers: {
            "Content-Type": "application/json",
        },
    });

    const response = await fetch.then((e) => e.data);

    return response;
};
