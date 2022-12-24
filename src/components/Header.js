import { Link } from "react-router-dom";
import { useContext } from "react";
import { MainContext } from "./MainContext";
import { FiArrowRight } from "react-icons/fi";
import styles from "../styles/modules/header.module.scss";

function Header() {
    const { dispatchLogin } = useContext(MainContext);

    return (
        <div className="container-fluid bg-info">
            <div className="row">
                <div className="col-12">
                    <header className="py-2">
                        <div className="row">
                            <div className="col-12">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="p-0 m-0 fw-normal">
                                        <Link
                                            className="text-white text-decoration-none text-secondary uppercase"
                                            href="/"
                                        >
                                            RP Images
                                        </Link>
                                    </h5>
                                    <Link
                                        href="/"
                                        className={
                                            `btn btn-sm btn-outline-danger text-white border-0 px-3 d-flex justify-content-start align-items-center ` +
                                            styles.logoutBtn
                                        }
                                        onClick={(e) =>
                                            dispatchLogin({ type: "SET_FALSE" })
                                        }
                                    >
                                        <small>Log Out</small>{" "}
                                        <FiArrowRight className="ms-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>
            </div>
        </div>
    );
}

export default Header;
