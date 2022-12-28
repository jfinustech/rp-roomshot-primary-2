import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { FiSearch } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import styles from "../styles/modules/topsearch.module.scss";
import { MainContext } from "./MainContext";

const VENDORLIST_URL = "https://sandbx.rugpal.com/office/jay/v2/designs.asp";

function Search() {
    const [vendorList, setVendorList] = useState([]);
    const { mainVendor, dispatch } = useContext(MainContext);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const fetch = async () => {
            await axios({
                method: "GET",
                url: VENDORLIST_URL,
                params: {
                    action: "VENDORLIST",
                },
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((d) => {
                    setVendorList(d.data);
                })
                .catch((er) => {
                    console.log(er.message);
                });
        };

        fetch();
    }, []);

    return (
        <form className={`${styles.topSearchWrapper}`}>
            <div className="d-flex justify-content-start align-items-center">
                <select
                    value={mainVendor}
                    className={`form-control rounded-0 border-0 border-bottom border-end px-3 ${styles.topSearchSelect}`}
                    name="vendor"
                    onChange={(e) => {
                        setSearchParams({});
                        dispatch({
                            type: "SET_VENDOR",
                            payload: e.target.value,
                        });
                    }}
                >
                    {vendorList?.map((vendor) => (
                        <option key={vendor.id} value={vendor.id}>
                            {vendor.name}
                        </option>
                    ))}
                </select>
                <input
                    type="search"
                    name="search"
                    className="form-control border-0 rounded-0 border-bottom p-3"
                    placeholder="Search ...."
                    results="5"
                    defaultValue={searchParams.get("search") ?? ""}
                />
            </div>
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
