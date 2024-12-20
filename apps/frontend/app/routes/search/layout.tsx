import { SpinnerCtxProvider } from "~/components/global-spinner";
import SearchPageLayout from "~/pages/search/layout";

export default function _() {
    return (
        <SpinnerCtxProvider>
            <SearchPageLayout />
        </SpinnerCtxProvider>
    );
}
