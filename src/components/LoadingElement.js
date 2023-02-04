export const initLoadingElement = () => {
    const existingdiv = document.querySelector("#loadingwrapper");

    if (existingdiv) existingdiv.remove();

    const div = document.createElement("div");
    div.id = "loadingwrapper";

    const div2 = document.createElement("div");
    div2.classList =
        "loadingcontainer d-flex justify-content-center align-items-center";

    const div3 = document.createElement("div");
    div3.classList = "lds-ripple";
    const div4 = document.createElement("div");
    const div5 = document.createElement("div");

    div3.appendChild(div4);
    div3.appendChild(div5);
    div2.appendChild(div3);
    div.appendChild(div2);

    document.querySelector("body").appendChild(div);
};

export const removeLoadingElement = () => {
    document.querySelector("#loadingwrapper").remove();
};
