import ClientOnly from "~/components/client-only";
import { SuspenseFallback } from "~/components/ui/spinner";
import OrgSettingsLayout from "~/pages/organization/settings/layout";

export default function _OrgSettingsLayout() {
    return <ClientOnly fallback={<SuspenseFallback />} Element={OrgSettingsLayout} />;
}
