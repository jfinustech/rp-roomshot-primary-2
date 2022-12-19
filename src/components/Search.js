import { FiSearch } from "react-icons/fi";
import styles from "../styles/modules/topsearch.module.scss";

function Search() {
    return (
        <form className={styles.topSearchWrapper}>
            <input
                type="search"
                name="search"
                className="form-control border-0 rounded-0 border-bottom p-3"
                placeholder="Search ...."
                results="5"
            />
            <button
                type="submit"
                className="btn p-0 rounded-0 d-flex justify-content-center align-items-center"
            >
                <FiSearch />
            </button>
        </form>
    );
}

export default Search;
