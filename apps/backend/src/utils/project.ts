import { VersionReleaseChannel } from "@app/utils/types";

export function GetReleaseChannelFilter(channel?: string) {
    // eg: beta-only
    // idk why someone would want that specifically but whatever
    if (typeof channel === "string" && channel.endsWith("-only")) return [channel.slice(0, -5)];

    if (!channel || channel === VersionReleaseChannel.ALPHA) {
        return [VersionReleaseChannel.ALPHA, VersionReleaseChannel.BETA, VersionReleaseChannel.RELEASE];
    }

    if (channel === VersionReleaseChannel.BETA) return [VersionReleaseChannel.BETA, VersionReleaseChannel.RELEASE];
    if (channel === VersionReleaseChannel.DEV) return [VersionReleaseChannel.DEV]; // TODO: decide later whtether to return all release channels or just dev
    return [VersionReleaseChannel.RELEASE];
}

export function AddFieldToObject<T extends object, K extends string, V>(obj: T, field: K, value: V): T & Record<K, V> {
    return { ...obj, [field]: value } as T & Record<K, V>;
}
