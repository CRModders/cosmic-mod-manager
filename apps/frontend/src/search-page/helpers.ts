import { Categories, type CategoryType, type LoaderType, Loaders } from "@root/config/project";
import type { ProjectType, TagHeaderTypes } from "@root/types";

export const getSelectedCategoryFilters = (params: string[]): string[] => {
    const selectedCategories: string[] = [];
    for (const category of Categories) {
        if (params.includes(category.name) && !selectedCategories.includes(category.name)) {
            selectedCategories.push(category.name);
        }
    }

    return selectedCategories;
};

export const getSelectedLoaderFilters = (params: string[]): string[] => {
    const selectedLoaders: string[] = [];
    for (const loader of Loaders) {
        const loaderName = loader.name.toLowerCase().replaceAll("_", "-");
        if (params.includes(loaderName) && !selectedLoaders.includes(loaderName)) {
            selectedLoaders.push(loaderName);
        }
    }

    return selectedLoaders;
};

export const getAllTaggedFilters = (projectType: ProjectType, tags: TagHeaderTypes[]) => {
    const allTaggedFilters = new Set<CategoryType>();

    for (const category of Categories) {
        if (category.project_types.includes(projectType) && tags.includes(category.header)) {
            allTaggedFilters.add(category);
        }
    }

    return Array.from(allTaggedFilters);
};

export const getAllLoaderFilters = (projectType: ProjectType) => {
    const allLoadersList = new Set<LoaderType>();

    for (const loader of Loaders) {
        if (loader.supported_project_types.includes(projectType)) {
            allLoadersList.add({
                ...loader,
                name: loader.name.toLowerCase().replaceAll("_", "-"),
            });
        }
    }

    return Array.from(allLoadersList);
};
