import { useRouteLoaderData } from "react-router";
import type { RootOutletData } from "~/root";

export function useRootData() {
    return useRouteLoaderData("root") as RootOutletData;
}
