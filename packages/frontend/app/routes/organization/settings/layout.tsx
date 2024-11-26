import ClientOnly from "~/components/client-only";
import OrgSettingsLayout from "~/pages/organization/settings/layout";

export default function _OrgSettingsLayout() {
    return <ClientOnly Element={OrgSettingsLayout} />;
}
