import { MeiliSearch } from "meilisearch";
const MEILISEARCH_MASTER_KEY = process.env.MEILISEARCH_MASTER_KEY;

if (!MEILISEARCH_MASTER_KEY) {
    throw new Error("MEILISEARCH_MASTER_KEY is not set");
}

const newMeilisearchClient = () => {
    return new MeiliSearch({
        host: "http://127.0.0.1:7700",
        apiKey: MEILISEARCH_MASTER_KEY,
    });
};

let meilisearch: MeiliSearch;

if (process.env.NODE_ENV === "production") {
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
