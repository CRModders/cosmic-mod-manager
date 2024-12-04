import { Outlet, useOutletContext } from "@remix-run/react";
import type { RootOutletData } from "~/root";

export default function ErrorHandler() {
    const data = useOutletContext<RootOutletData>();

    return <Outlet context={data satisfies RootOutletData} />;
}
