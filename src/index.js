import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Template from "./components/Template";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainContextProvider from "./components/MainContext";
import "./styles/bootstrap.scss";
import "./styles/globals.scss";
import "bootstrap/dist/js/bootstrap.bundle.min";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    // <React.StrictMode>
    <MainContextProvider>
        <BrowserRouter>
            <Routes>
                <Route
                    path="/rp-roomshot-primary-2/"
                    element={
                        <Template>
                            <App />
                        </Template>
                    }
                ></Route>
            </Routes>
        </BrowserRouter>
    </MainContextProvider>
    // </React.StrictMode>
);
