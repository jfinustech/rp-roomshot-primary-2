import axios from "axios";
const SETHARDDELETE_URL = "https://sandbx.rugpal.com/office/jay/v2/designs.asp";

export const SetHardDelete = async (id) => {
    const fetch = axios({
        method: "POST",
        url: SETHARDDELETE_URL,
        params: {
            id: id,
            action: "SETHARDDELETE",
        },
        headers: {
            "Content-Type": "application/json",
        },
    });

    const response = await fetch.then((e) => e.data);

    return response;
};

export const SetHardDeleteBulk = async (id) => {
    const fetch = axios({
        method: "POST",
        url: SETHARDDELETE_URL,
        params: {
            id: id,
            action: "SETHARDDELETEBULK",
        },
        headers: {
            "Content-Type": "application/json",
        },
    });

    const response = await fetch.then((e) => e.data);

    return response;
};
