import { useContext } from "react";
import { MainContext } from "./MainContext";
import Login from "../Login";

function Auth({ children }) {
    const { isLoggedIn } = useContext(MainContext);

    if (!isLoggedIn) return <Login />;

    return <>{children}</>;
}

export default Auth;
