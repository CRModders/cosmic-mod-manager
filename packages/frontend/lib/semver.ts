import GAME_VERSIONS, { getGameVersionFromValue } from "@shared/config/game-versions";

export const sortVersionsWithReference = (versions: string[], referenceList: string[]): string[] => {
    return versions.sort((a, b) => referenceList.indexOf(a) - referenceList.indexOf(b));
};

export const groupContinuousVersions = (versions: string[], referenceList: string[]): string[][] => {
    const groupedList: string[][] = [[]];
    const sortedVersions = sortVersionsWithReference(versions, referenceList);
    let refListIndex = referenceList.indexOf(sortedVersions[0]);

    if (refListIndex === -1) return groupedList;

    for (let i = 0; i < sortedVersions.length; i++) {
        refListIndex += 1;
        groupedList.at(-1)?.push(sortedVersions[i]);

        if (sortedVersions[i + 1] === referenceList[refListIndex]) continue;
        if (i < sortedVersions.length - 1) {
            groupedList.push([]);
            refListIndex = referenceList.indexOf(sortedVersions[i + 1]);
        }
    }

    return groupedList;
};

export const getGroupedVersionsList = (list: string[]): string[] => {
    if (list.length < 2) return [...list];

    const formattedList: string[] = [];
    const groupedVersions = groupContinuousVersions(
        list,
        GAME_VERSIONS.map((version) => version.value),
    );

    for (const versionGroup of groupedVersions) {
        if (versionGroup.length === 1) formattedList.push(versionGroup[0]);
        else {
            formattedList.push(`${versionGroup.at(-1)}–${versionGroup[0]}`);
        }
    }

    return formattedList;
};

export const formatGameVersionsList = (list: string[]): string[] => {
    const formattedList: string[] = [];
    const groupedVersions = groupContinuousVersions(
        list,
        GAME_VERSIONS.map((version) => version.value),
    );

    for (const versionGroup of groupedVersions) {
        const firstItem = getGameVersionFromValue(versionGroup[0])?.label;

        if (firstItem && versionGroup.length === 1) formattedList.push(firstItem);
        else {
            const lastItem = getGameVersionFromValue(versionGroup.at(-1) || "")?.label;
            formattedList.push(`${lastItem}–${firstItem}`);
        }
    }
    return formattedList;
};

export const formatGameVersionsListString = (list: string[]): string => {
    let formattedStr = "";
    const groupedVersions = groupContinuousVersions(
        list,
        GAME_VERSIONS.map((version) => version.value),
    );

    for (const versionGroup of groupedVersions) {
        const firstItem = getGameVersionFromValue(versionGroup[0])?.label;

        if (versionGroup.length === 1) formattedStr += `${firstItem}, `;
        else {
            const lastItem = getGameVersionFromValue(versionGroup.at(-1) || "")?.label;
            formattedStr += `${lastItem}–${firstItem}, `;
        }
    }

    return formattedStr.slice(0, -2);
};
