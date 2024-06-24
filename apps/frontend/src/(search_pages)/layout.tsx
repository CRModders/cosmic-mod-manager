import { Outlet } from "react-router-dom";

export default function SearchPagesSharedLayout() {
    console.log("SEARCH PAGE LAYOUT RENDERING...");
    return (
        <>
            <Outlet />
        </>
    )
}
