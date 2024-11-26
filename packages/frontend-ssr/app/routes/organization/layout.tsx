import ClientOnly from "~/components/client-only";
import { SuspenseFallback } from "~/components/ui/spinner";
import OrgPageLayout from "~/pages/organization/layout";

export default function _OrganizationLayout() {
    return <ClientOnly fallback={<SuspenseFallback />} Element={OrgPageLayout} />;
}
