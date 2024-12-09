import { Outlet, useOutletContext } from "react-router";
import type { RootOutletData } from "~/root";

export default function ErrorHandler() {
    const data = useOutletContext<RootOutletData>();

    return <Outlet context={data satisfies RootOutletData} />;
}
