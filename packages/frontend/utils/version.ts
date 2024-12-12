import GAME_VERSIONS, { type GameVersion, getGameVersionsFromValues, isExperimentalGameVersion } from "@shared/config/game-versions";
import { sortVersionsWithReference } from "@shared/lib/utils/project";

const gameVersionIndex = (version: GameVersion, referenceList: GameVersion[]): number => {
    for (let i = 0; i < referenceList.length; i++) {
        if (referenceList[i].value === version.value) return i;
    }

    return -1;
};

export const groupContinuousVersions = (versions: string[]): GameVersion[][] => {
    let referenceList = GAME_VERSIONS;
    const groupedList: GameVersion[][] = [[]];
    const sortedVersions = getGameVersionsFromValues(
        sortVersionsWithReference(
            versions,
            referenceList.map((version) => version.value),
        ),
    );

    if (!sortedVersions.length) return groupedList;

    // If the original version list doesn't have experimental versions, filter them out from the reference list
    if (!sortedVersions.some((item) => isExperimentalGameVersion(item.releaseType))) {
        referenceList = referenceList.filter((version) => !isExperimentalGameVersion(version.releaseType));
    }

    let refListIndex = gameVersionIndex(sortedVersions[0], referenceList);
    if (refListIndex === -1) return [[]];

    for (let i = 0; i < sortedVersions.length; i++) {
        const currItem = sortedVersions[i];
        const nextItem = sortedVersions[i + 1];
        refListIndex = gameVersionIndex(currItem, referenceList);

        groupedList.at(-1)?.push(currItem);

        const currItemIsExperimental = isExperimentalGameVersion(currItem.releaseType);
        const nextItemIsExperimental = nextItem ? isExperimentalGameVersion(nextItem.releaseType) : false;

        // If the next item is not the next version in the reference list, start a new group
        if (nextItem && gameVersionIndex(nextItem, referenceList) !== refListIndex + 1) {
            groupedList.push([]);
        }
        // If the next item is experimental and the current item is not or vice versa, start a new group
        else if (nextItem && currItemIsExperimental !== nextItemIsExperimental) {
            groupedList.push([]);
        }
    }

    return groupedList;
};

export const formatGameVersionsList_verbose = (list: string[]): string[] => {
    if (!list.length) return [];

    const formattedList: string[] = [];
    const groupedVersions = groupContinuousVersions(list);

    for (const versionGroup of groupedVersions) {
        const firstItem = versionGroup[0]?.label;

        if (firstItem && versionGroup.length === 1) formattedList.push(firstItem);
        else {
            const lastItem = versionGroup.at(-1)?.label;
            formattedList.push(`${lastItem}–${firstItem}`);
        }
    }
    return formattedList;
};

export const formatGameVersionsListString_verbose = (list: string[]): string => {
    if (!list.length) return "";

    let formattedStr = "";
    const groupedVersions = groupContinuousVersions(list);

    for (const versionGroup of groupedVersions) {
        const firstItem = versionGroup[0]?.label;

        if (versionGroup.length === 1) formattedStr += `${firstItem}, `;
        else {
            const lastItem = versionGroup.at(-1)?.label;
            formattedStr += `${lastItem}–${firstItem}, `;
        }
    }

    return formattedStr.slice(0, -2);
};
