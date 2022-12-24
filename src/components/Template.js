import Auth from "./Auth";
import Header from "./Header";
import Search from "./Search";
// import SearchFilter from "./SearchFilter";

function Template({ children }) {
    return (
        <Auth>
            <Header />
            <Search />
            {/* <SearchFilter /> WORK ON THIS LATER */}
            {children}
        </Auth>
    );
}

export default Template;
