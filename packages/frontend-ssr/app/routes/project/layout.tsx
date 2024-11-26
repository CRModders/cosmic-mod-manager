import { useOutletContext } from "@remix-run/react";
import ClientOnly from "~/components/client-only";
import { SuspenseFallback } from "~/components/ui/spinner";
import ProjectPageLayout from "~/pages/project/layout";
import type { ProjectDataWrapperContext } from "./data-wrapper";

export default function _ProjectLayout() {
    const data = useOutletContext<ProjectDataWrapperContext>();

    return <ClientOnly fallback={<SuspenseFallback />} Element={() => <ProjectPageLayout {...data} />} />;
}
