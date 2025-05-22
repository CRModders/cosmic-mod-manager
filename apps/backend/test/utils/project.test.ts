import { describe, expect, test } from "bun:test";

import { VersionReleaseChannel } from "@app/utils/types";
import { GetReleaseChannelFilter } from "~/utils/project";

describe("GetReleaseChannelFilter", () => {
    test("handles undefined input", () => {
        expect(GetReleaseChannelFilter()).toEqual([VersionReleaseChannel.RELEASE]);
    });

    test("returns correct channels", () => {
        expect(GetReleaseChannelFilter("alpha")).toEqual([
            VersionReleaseChannel.RELEASE,
            VersionReleaseChannel.BETA,
            VersionReleaseChannel.ALPHA,
        ]);
    });

    test("handles -only suffix", () => {
        expect(GetReleaseChannelFilter("dev-only")).toEqual([VersionReleaseChannel.DEV]);
    });
});
