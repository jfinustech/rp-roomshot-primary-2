import Header from "../components/Header";
import Search from "../components/Search";

function Template({ children }) {
    return (
        <>
            <Header />
            <Search />
            {children}
        </>
    );
}

export default Template;
