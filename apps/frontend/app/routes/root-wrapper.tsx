import { Outlet, useOutletContext } from "react-router";
import type { RootOutletData } from "~/root";
import ErrorView from "./error-view";

export default function ErrorHandler() {
    const data = useOutletContext<RootOutletData>();

    return <Outlet context={data satisfies RootOutletData} />;
}

export function ErrorBoundary() {
    return <ErrorView />;
}
