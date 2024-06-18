import { Loaders, ProjectTypes } from "@root/config/project";
import type { ProjectType } from "@root/types";


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
    const projectTypes = new Set<ProjectType>();

    for (const projectLoader of projectLoaders) {
        for (const availableLoader of Loaders) {
            if (availableLoader.name === projectLoader) {
                for (const supportedProjectType of availableLoader.supported_project_types) {
                    projectTypes.add(supportedProjectType);
                }
                break;
            }
        }
    }

    const list = OrderProjectTypes(Array.from(projectTypes));
    return list.length > 0 ? list : ["PROJECT"];
}