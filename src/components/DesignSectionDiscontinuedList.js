import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { loadingRaw } from "./Loading";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { CSVLink } from "react-csv";

export default function DesignSectionDiscontinuedList({ data }) {
    const FETCH_URL = "https://sandbx.rugpal.com/office/jay/v2/designs.asp";

    const [fetchSkuList, setFetchSkuList] = useState(null);
    const [designID, setDesignID] = useState(null);
    const [designDropdown, setDesignDropdown] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [totalData, setTotalData] = useState(null);
    const [sortAsc, setSortAsc] = useState(true);
    const [sortAscIcon, setSortAscIcon] = useState(
        <span className="arrowindicator ms-2" style={{ width: 15 }}></span>
    );

    const filterDesign = useCallback(
        (e, data) => {
            const selectedDesign = typeof e === "object" ? e.target.value : e;
            setDesignID(selectedDesign);
            const totalDataArray = {
                total_sku: 0,
                total_discontinued: 0,
                total_rugs_com: 0,
                total_rp_wayfair: 0,
                total_rp_overstock: 0,
            };

            const fetchedItems = data ?? fetchSkuList;
            fetchedItems.map((item) => {
                item.show =
                    selectedDesign === "All"
                        ? 1
                        : item.designID === selectedDesign
                        ? 1
                        : 0;
                return item;
            });

            const filteredFetchedItems = fetchedItems.filter(
                (e) => e.show === 1
            );

            for (const itm of filteredFetchedItems) {
                totalDataArray.total_sku += 1;
                totalDataArray.total_discontinued += itm.discontinued_sku
                    ? 1
                    : 0;
                totalDataArray.total_rugs_com += itm.rugs_com_sku ? 1 : 0;
                totalDataArray.total_rp_wayfair += itm.rugpal_wayfair ? 1 : 0;
                totalDataArray.total_rp_overstock += itm.rugpal_overstock
                    ? 1
                    : 0;
            }

            setTotalData(totalDataArray);

            setFetchSkuList(fetchedItems);
        },
        [fetchSkuList]
    );

    useEffect(() => {
        const fetch = async () => {
            await axios({
                method: "GET",
                url: FETCH_URL,
                params: {
                    vendor: data.vendor,
                    search: data.collection,
                    action: "GETSKUDISCLIST",
                },
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((d) => {
                    const dropdown = ["All"];
                    d.data.map((item) =>
                        dropdown.indexOf(item.designID) === -1
                            ? dropdown.push(item.designID)
                            : false
                    );

                    setDesignDropdown(dropdown);

                    setFetchSkuList(d.data);
                    setDesignID(data.designid, d.data);
                    filterDesign(data.designid, d.data);
                    setIsLoading(false);
                })
                .catch((er) => {
                    console.log(er);
                    setHasError(true);
                    setIsLoading(false);
                });
        };

        fetch();
    }, [data.vendor, data.collection, data.designid]);

    const sortItemsData = (e, sortby = "") => {
        const fetchedItems = fetchSkuList;
        const sortAscValue = !sortAsc;

        //hide all arrows

        if (sortAscValue) {
            setSortAscIcon(
                <span className="arrowindicator ms-2" style={{ width: 15 }}>
                    <FiChevronUp />
                </span>
            );
        } else {
            setSortAscIcon(
                <span className="arrowindicator ms-2" style={{ width: 15 }}>
                    <FiChevronDown />
                </span>
            );
        }

        const allarrows = document.querySelectorAll(".arrowindicator");
        console.log(allarrows.length);
        if (allarrows.length > 0)
            allarrows.forEach((z) => (z.style.opacity = 0));
        if (e.currentTarget.querySelector(".arrowindicator"))
            e.currentTarget.querySelector(".arrowindicator").style.opacity = 1;

        fetchedItems.sort(function (a, b) {
            if (a[sortby] < b[sortby]) {
                return sortAscValue ? -1 : 1;
            }
            if (a[sortby] > b[sortby]) {
                return sortAscValue ? 1 : -1;
            }
            return 0;
        });

        setSortAsc(sortAscValue);

        filterDesign(designID, fetchedItems);
    };

    return (
        <small>
            {isLoading && loadingRaw}
            {hasError && (
                <div>
                    Data fetch error. Try again.
                    <br />
                    {hasError}
                </div>
            )}
            {!isLoading && !hasError && (
                <>
                    <div className="d-block mb-3">
                        <select
                            className="form-control form-control-sm"
                            value={designID}
                            onChange={(e) => filterDesign(e)}
                        >
                            {designDropdown.map((item, index) => (
                                <option key={index}>{item}</option>
                            ))}
                        </select>
                    </div>
                    {totalData && (
                        <div className="border rounded-1 p-3 my-3 bg-light">
                            <div className="row align-items-center">
                                <div className="col-2">
                                    <span className="text-muted">SKU: </span>
                                    <b>{totalData.total_sku}</b>
                                </div>
                                <div className="col-2">
                                    <span className="text-muted">
                                        Discontinued:{" "}
                                    </span>
                                    <b>{totalData.total_discontinued}</b>
                                </div>
                                <div className="col-2">
                                    <span className="text-muted">
                                        Rugs.com:{" "}
                                    </span>
                                    <b>{totalData.total_rugs_com}</b>
                                </div>
                                <div className="col-2">
                                    <span className="text-muted">
                                        RP-Wayfair:{" "}
                                    </span>
                                    <b>{totalData.total_rp_wayfair}</b>
                                </div>
                                <div className="col-2">
                                    <span className="text-muted">
                                        RP-Overstock:{" "}
                                    </span>
                                    <b>{totalData.total_rp_overstock}</b>
                                </div>
                                <div className="col-2 text-end">
                                    <CSVLink
                                        data={Object.values(
                                            fetchSkuList.filter(
                                                (f) => f.show === 1
                                            )
                                        )}
                                        filename={`${data.collection
                                            .replace(/\s+/g, "-")
                                            .toLowerCase()}-${designID}-report.csv`}
                                        className="btn btn-sm btn-primary"
                                    >
                                        Download CSV
                                    </CSVLink>
                                </div>
                            </div>
                        </div>
                    )}

                    <table className="table table-hover">
                        <thead className="sticky-top bg-white border-bottom border-primary">
                            <tr>
                                <th
                                    onClick={(e) => sortItemsData(e, "SKU")}
                                    className="cursor-pointer"
                                >
                                    SKU
                                    {sortAscIcon}
                                </th>
                                <th
                                    onClick={(e) =>
                                        sortItemsData(e, "designID")
                                    }
                                    className="cursor-pointer"
                                >
                                    Design
                                    {sortAscIcon}
                                </th>
                                <th
                                    onClick={(e) =>
                                        sortItemsData(e, "designColor")
                                    }
                                    className="cursor-pointer"
                                >
                                    Color
                                    {sortAscIcon}
                                </th>
                                <th
                                    onClick={(e) =>
                                        sortItemsData(e, "discontinued_sku")
                                    }
                                    className="cursor-pointer text-center"
                                >
                                    Discontinued
                                    {sortAscIcon}
                                </th>
                                <th
                                    onClick={(e) =>
                                        sortItemsData(e, "rugs_com_sku")
                                    }
                                    className="cursor-pointer text-center"
                                >
                                    Rugs.com
                                    {sortAscIcon}
                                </th>
                                <th
                                    onClick={(e) =>
                                        sortItemsData(e, "rugpal_overstock")
                                    }
                                    className="cursor-pointer text-center"
                                >
                                    RP Overstock
                                    {sortAscIcon}
                                </th>
                                <th
                                    onClick={(e) =>
                                        sortItemsData(e, "rugpal_wayfair")
                                    }
                                    className="cursor-pointer text-center"
                                >
                                    RP Wayfair
                                    {sortAscIcon}
                                </th>
                                <th
                                    onClick={(e) => sortItemsData(e, "qty")}
                                    className="cursor-pointer text-center"
                                >
                                    UL Stock
                                    {sortAscIcon}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {fetchSkuList.map((item) => {
                                return (
                                    item.show === 1 && (
                                        <tr
                                            key={item.SKU}
                                            className="border-bottom"
                                        >
                                            <td>{item.SKU}</td>
                                            <td>{item.designID}</td>
                                            <td>{item.designColor}</td>
                                            <td className="text-center">
                                                {item.discontinued_sku
                                                    ? "Yes"
                                                    : "No"}
                                            </td>
                                            <td className="text-center">
                                                {item.rugs_com_sku
                                                    ? "Yes"
                                                    : "No"}
                                            </td>
                                            <td className="text-center">
                                                {item.rugpal_overstock
                                                    ? "Yes"
                                                    : "No"}
                                            </td>
                                            <td className="text-center">
                                                {item.rugpal_wayfair
                                                    ? "Yes"
                                                    : "No"}
                                            </td>
                                            <td className="text-center">
                                                {item.qty}
                                            </td>
                                        </tr>
                                    )
                                );
                            })}
                        </tbody>
                    </table>
                </>
            )}
        </small>
    );
}
