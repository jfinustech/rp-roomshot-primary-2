import { HandleModal } from "../aux/HandleModal";
export default function DesignSectionDiscontinuedBadge({
    design,
    vendor,
    collection,
    designid,
}) {
    const fetchSkuList = () => {
        HandleModal(
            "SKU List",
            "DesignSectionDiscontinuedList",
            {
                vendor,
                collection,
                designid,
            },
            null,
            "modal-lg"
        );
    };

    return (
        <>
            {design.is_rugscom && (
                <small
                    className="border rounded rounded-1 text-danger ms-3 border-danger py-1 px-2 d-inline-block cursor-pointer"
                    style={{ fontSize: 14 }}
                    onClick={() => fetchSkuList()}
                >
                    rugs.com
                </small>
            )}

            {/* {design.is_discontinued === 0 && (
            <small
                className="border rounded rounded-1 text-danger ms-3 border-danger py-1 px-2 d-inline-block"
                style={{ fontSize: 14 }}
            >
                Discontinued
            </small>
        )} */}
            {design.is_discontinued > 0 && (
                <small
                    className="border rounded rounded-1 text-danger ms-3 border-danger py-1 px-2 d-inline-block cursor-pointer"
                    style={{ fontSize: 14 }}
                    onClick={() => fetchSkuList()}
                >
                    Discontinued{" "}
                    {design.total_stock > 0 && <>Width Inventory</>}
                </small>
            )}
            {design.is_discontinued < 0 && (
                <small
                    className="border rounded rounded-1 text-success ms-3 border-success py-1 px-2 d-inline-block cursor-pointer"
                    style={{ fontSize: 14 }}
                    onClick={() => fetchSkuList()}
                >
                    All Active
                </small>
            )}
        </>
    );
}
