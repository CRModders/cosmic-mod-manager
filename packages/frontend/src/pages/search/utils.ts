import { type Loader, loaders } from "@shared/config/project";
import type { ProjectType } from "@shared/types";

export const getAllLoaderFilters = (projectType: ProjectType) => {
    const allLoadersList = new Set<Loader>();

    for (const loader of loaders) {
        if (loader.supportedProjectTypes.includes(projectType) && loader?.metadata?.visibleInCategoriesList !== false) {
            allLoadersList.add(loader);
        }
    }

    return Array.from(allLoadersList);
};
