import { MeiliSearch } from "meilisearch";
import env from "~/utils/env";

const newMeilisearchClient = () => {
    return new MeiliSearch({
        host: "http://127.0.0.1:7700",
        apiKey: env.MEILISEARCH_MASTER_KEY,
    });
};

let meilisearch: MeiliSearch;

if (env.NODE_ENV === "production") {
    meilisearch = newMeilisearchClient();
} else {
    // @ts-ignore
    if (!global.meilisearch) {
        // @ts-ignore
        global.meilisearch = newMeilisearchClient();
    }
    // @ts-ignore
    meilisearch = global.meilisearch;
}

export default meilisearch;
