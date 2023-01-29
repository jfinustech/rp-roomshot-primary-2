import { createContext, useReducer, useState } from "react";

export const MainContext = createContext();

const checkLoginStatus = (state, action) => {
    switch (action.type) {
        case "SET_TRUE":
            localStorage.setItem("user", process.env.REACT_APP_USERNAME);
            return true;
        case "SET_FALSE":
            localStorage.removeItem("user");
            return false;
        default:
            return false;
    }
};

const handleReducer = (state, action) => {
    switch (action.type) {
        case "SET_VENDOR":
            const payload = action.payload;
            localStorage.setItem("mainVendor", payload);
            return payload;

        default:
            return state;
    }
};

const handleHideDeleted = (state, action) => {
    switch (action.type) {
        case "HIDE_DELETED":
            const payload = action.payload;
            localStorage.setItem("hideDeleted", payload);
            return payload;
        default:
            return state;
    }
};
const handleHideAssigned = (state, action) => {
    switch (action.type) {
        case "HIDE_ASSIGNED":
            const payload = action.payload;
            localStorage.setItem("hideAssigned", payload);
            return payload;
        default:
            return state;
    }
};
const handleToggleImagePop = (state, action) => {
    switch (action.type) {
        case "TOGGLE_POPUP":
            const payload = action.payload;
            localStorage.setItem("toggleImagePop", payload);
            return payload;
        default:
            return state;
    }
};
const handleGalleryMode = (state, action) => {
    switch (action.type) {
        case "TOGGLE_GALLERY_MODE":
            const payload = action.payload;
            localStorage.setItem("galleryMode", payload);
            return payload;
        default:
            return state;
    }
};

const MainContextProvider = (props) => {
    const current_login_state =
        localStorage.getItem("user") &&
        localStorage.getItem("user") === process.env.REACT_APP_USERNAME
            ? true
            : false;

    const [isLoggedIn, dispatchLogin] = useReducer(
        checkLoginStatus,
        current_login_state
    );

    const [mainVendor, dispatch] = useReducer(
        handleReducer,
        localStorage.getItem("mainVendor") ?? 8800
    );
    const [hideDeleted, dispatchHideDelete] = useReducer(
        handleHideDeleted,
        localStorage.getItem("hideDeleted") ?? "0"
    );
    const [hideAssigned, dispatchHideAssigned] = useReducer(
        handleHideAssigned,
        localStorage.getItem("hideAssigned") ?? "0"
    );
    const [toggleImagePop, dispatchToggleImagePop] = useReducer(
        handleToggleImagePop,
        localStorage.getItem("imagePop") ?? false
    );

    const [galleryMode, dispatchGalleryMode] = useReducer(
        handleGalleryMode,
        localStorage.getItem("galleryMode") ?? false
    );

    const contextValues = {
        isLoggedIn,
        dispatchLogin,
        mainVendor,
        dispatch,
        hideDeleted,
        dispatchHideDelete,
        hideAssigned,
        dispatchHideAssigned,
        toggleImagePop,
        dispatchToggleImagePop,
        galleryMode,
        dispatchGalleryMode,
    };

    return (
        <MainContext.Provider value={contextValues}>
            {props.children}
        </MainContext.Provider>
    );
};

export default MainContextProvider;
