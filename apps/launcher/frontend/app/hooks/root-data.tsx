import { useRouteLoaderData } from "react-router";
import type { RootData } from "~/root";

export default function useRootData() {
    return useRouteLoaderData<RootData>("root");
}
