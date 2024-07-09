import { Categories, type CategoryType, type LoaderType, Loaders } from "@root/config/project";
import { createURLSafeSlug } from "@root/lib/utils";
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
        const loaderName = createURLSafeSlug(loader.name).value;
        if (params.includes(loaderName) && !selectedLoaders.includes(loaderName)) {
            selectedLoaders.push(loader.name);
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
        if (
            loader.supported_project_types.includes(projectType) &&
            loader?.metadata?.visible_in_version_list !== false
        ) {
            allLoadersList.add(loader);
        }
    }

    return Array.from(allLoadersList);
};

type filterStringGenerationProps = {
    projectType: string;
    query: string;
    loaderFiltersList: string[];
    categoryFiltersList: string[];
    ossOnly: boolean;
    includeQuery?: boolean;
};

const URIEncodeStringList = (list: string[]): string[] => {
    for (let i = 0; i < list.length; i++) {
        list[i] = encodeURIComponent(list[i]);
    }

    return list;
};

export const generateSearchFilterString = ({
    projectType,
    query,
    loaderFiltersList,
    categoryFiltersList,
    ossOnly,
    includeQuery = false,
}: filterStringGenerationProps): string => {
    let filter = `type = ${encodeURIComponent(projectType)}`;
    if (loaderFiltersList.length > 0)
        filter += ` AND ( loaders = ${URIEncodeStringList(loaderFiltersList).join(" AND loaders = ")})`;
    if (categoryFiltersList.length > 0)
        filter += ` AND ( tags = ${URIEncodeStringList(categoryFiltersList).join(" AND tags = ")} )`;
    if (ossOnly) filter += " AND oss = true";
    if (includeQuery && query) filter += ` AND query = ${query}`;

    return filter;
};
