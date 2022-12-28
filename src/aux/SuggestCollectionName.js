import axios from "axios";

const SUGGESTCOLLECTIONNAME_URL =
    "https://sandbx.rugpal.com/office/jay/v2/designs.asp";

export const SuggestCollectionName = async () => {
    return await axios({
        method: "GET",
        url: SUGGESTCOLLECTIONNAME_URL,
        params: {
            action: "SUGGESTCOLLECTIONNAME",
        },
        headers: {
            "Content-Type": "application/json",
        },
    });
};
