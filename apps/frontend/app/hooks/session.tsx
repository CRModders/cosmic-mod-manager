import { useRootData } from "./root-data";

export function useSession() {
    return useRootData().session;
}
