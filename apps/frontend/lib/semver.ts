import { GameVersions } from "@root/config/project";
import { sort } from "semver";

const GetContinuousItems = <T>(items: T[], referenceList: T[], startIndex: number): T[] => {
    const continuousList: T[] = [];

    let index = startIndex;
    let indexInRefList = referenceList.indexOf(items[index]);
    for (index; index < items.length; index++) {
        continuousList.push(items[index]);
        indexInRefList++;

        if (items[index + 1] !== referenceList[indexInRefList]) {
            return continuousList;
        }
    }

    return continuousList;
};

export const FormatVersionsList = (list: string[]): string => {
    const sortedList = sort(list).reverse();
    const groupedVersionsList: string[][] = [];

    for (let i = 0; i < list.length; null) {
        const continuousVersions = GetContinuousItems<string>(sortedList, GameVersions.map((version) => version.version), i);
        groupedVersionsList.push(continuousVersions);
        i += continuousVersions.length;
    }

    let representationString = "";
    for (const versionList of groupedVersionsList) {
        if (versionList.length === 1) representationString += `${versionList[0]}, `;
        else {
            representationString += `${versionList.at(-1)}–${versionList[0]}, `;
        }
    }

    return representationString.slice(0, -2);
};
