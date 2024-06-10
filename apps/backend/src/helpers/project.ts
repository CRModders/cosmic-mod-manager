import { Loaders, ProjectTypes } from "@root/config/project";
import type { ProjectType } from "@root/types";


const GetUniqueArrayItems = <T>(list: T[]) => {
    const UniqueItemsList: T[] = [];
    for (const item of list) {
        if (!UniqueItemsList.includes(item)) {
            UniqueItemsList.push(item);
        }
    }

    return UniqueItemsList;
}

const OrderProjectTypes = (list: ProjectType[]) => {
    const orderedList: ProjectType[] = [];

    for (const projectType of ProjectTypes) {
        if (list.includes(projectType)) {
            orderedList.push(projectType);
        }
    };

    return orderedList;
};

export const InferProjectTypeFromLoaders = (projectLoaders: string[]) => {
    const projectTypes: ProjectType[] = [];

    for (const projectLoader of projectLoaders) {
        for (const availableLoader of Loaders) {
            if (availableLoader.name === projectLoader) {
                projectTypes.push(...availableLoader.supported_project_types);
                break;
            }
        }
    }

    const orderedList = OrderProjectTypes(GetUniqueArrayItems(projectTypes));
    return orderedList.length > 0 ? orderedList : ["PROJECT"];
}