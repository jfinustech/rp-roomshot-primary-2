import { useState, useEffect, useContext } from "react";
import styles from "./styles/modules/login.module.scss";
import { FiArrowRight } from "react-icons/fi";
import { MainContext } from "./components/MainContext";

const PUBLIC_URL = process.env.PUBLIC_URL;

function Login() {
    const [gallery, setGallery] = useState(`${PUBLIC_URL}/images/login/0.jpg`);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { isLoggedIn, dispatchLogin } = useContext(MainContext);

    useEffect(() => {
        const randomImage = () => {
            const imageUrl =
                `${PUBLIC_URL}/images/login/` +
                String(Math.floor(Math.random() * 4) + 1) +
                ".jpg";

            const bg = new Image();
            bg.src = imageUrl;
            bg.onload = () => {
                setGallery(imageUrl);
            };
        };

        randomImage();
        const interv = setInterval(randomImage, 5000);

        return () => clearInterval(interv);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (
            username === process.env.REACT_APP_USERNAME &&
            password === process.env.REACT_APP_PASSWORD
        ) {
            setError("");
            dispatchLogin({ type: "SET_TRUE" });
        } else {
            setError("Invalid username or password. Try again.");
            dispatchLogin({ type: "SET_FALSE" });
        }
    };

    return (
        <>
            <main className={`container-fluid`}>
                <div className="row vh-100">
                    <div
                        className={
                            `col-12 col-md-7 d-none d-md-block bg-light ` +
                            styles.loginGallery
                        }
                        style={{
                            backgroundImage: "url('" + gallery + "')",
                        }}
                    >
                        <div className="d-flex justify-content-center align-items-center vh-100">
                            {/* <img src="" alt="logo" /> */}
                            <img
                                src={`${PUBLIC_URL}/logo.svg`}
                                width={150}
                                height={150}
                                alt="logo"
                                className="shadow"
                            />
                        </div>
                    </div>
                    <div className={`col-12 col-md-5 bg-light`}>
                        <div className="d-flex justify-content-center align-items-center vh-100">
                            <form
                                className={styles.loginForm}
                                onSubmit={handleLogin}
                            >
                                <label
                                    htmlFor="username"
                                    className="form-label user-select-none text-secondary"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    className="form-control"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                                <label
                                    htmlFor="password"
                                    className="form-label user-select-none text-secondary mt-3"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                {error !== "" && (
                                    <div className="text-danger my-2">
                                        <small>{error}</small>
                                    </div>
                                )}
                                <div className="d-block text-end mt-4">
                                    <button className="btn btn-primary px-3">
                                        Log-in <FiArrowRight />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Login;
